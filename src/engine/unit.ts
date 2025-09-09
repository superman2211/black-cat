import { getColoredImage, images } from "../resources/images";
import { Vector2 } from "../utils/geom";
import { chance, limit, mathAbs, mathHypot, mathRound, numberMax, randomChancesSelect, randomRange, randomSelect } from "../utils/math";
import { deltaS } from "../utils/time";
import { animationDuration, AnimationFrame, getFrameImage, isAnimationFinished } from "./animation";
import { addEffect, hitEffect, hitMiniEffect, hitRedEffect } from "./effect";
import { Sprite } from "./sprite";
import { getStage } from "./stage";

export const units: Array<Unit> = [];

export const enum UnitState {
    Stand,
    Walk,
    Jab,
    Cross,
    Kick,
    Damage,
    Dead,
}

export interface Unit {
    config: UnitConfig,
    state: UnitState,
    controller: {
        move: Vector2,
        hand: boolean,
        cross: boolean,
        leg: boolean,
    },
    health: number,
    direction: number,
    position: Vector2,
    speed: Vector2,
    animationTime: number,
    animation?: Array<AnimationFrame>,
    sprite: Sprite,
    shadow: Sprite,
    frame: number,
    damage: number,
}

export interface UnitConfig {
    mob: boolean,
    health: number,
    walkSpeed: number,
    offset: Vector2,
    animations: {
        stand: Array<AnimationFrame>,
        walkH: Array<AnimationFrame>,
        walkV: Array<AnimationFrame>,
        jab: Array<AnimationFrame>,
        cross: Array<AnimationFrame>,
        kick: Array<AnimationFrame>,
        damage1: Array<AnimationFrame>,
        damage2: Array<AnimationFrame>,
        knockdown: Array<AnimationFrame>,
        dead1: Array<AnimationFrame>,
        dead2: Array<AnimationFrame>,
    },
    damages: { [key: number]: number },
}

export const addUnit = (config: UnitConfig): Unit => {
    let unit: Unit = {
        config,
        state: UnitState.Stand,
        controller: {
            move: {
                x: 0,
                y: 0
            },
            hand: false,
            leg: false,
            cross: false
        },
        health: config.health,
        direction: 1,
        position: {
            x: 0,
            y: 0
        },
        speed: {
            x: 0,
            y: 0
        },
        animationTime: 0,
        sprite: {
            image: 0,
        },
        shadow: {
            image: 0,
        },
        damage: 0,
        frame: 0,
    };

    units.push(unit);

    return unit;
}

export const removeUnit = (unit: Unit) => {
    const index = units.indexOf(unit);
    if (index != -1) {
        units.splice(index, 1);
    }
}

export const clearUnits = () => {
    units.splice(0, units.length);
}

export const limitUnitsPositions = () => {
    const stage = getStage();

    for (const unit of units.values()) {
        unit.position.x = limit(stage.bounds.x, stage.bounds.x + stage.bounds.w, unit.position.x);
        unit.position.y = limit(stage.bounds.y, stage.bounds.y + stage.bounds.h, unit.position.y);
    }
}

export const updateUnits = () => {
    for (const unit of units.values()) {
        updateUnit(unit);
    }
}

const updateUnit = (unit: Unit) => {
    let currentAnimation = null;

    const config = unit.config;
    const animations = config.animations;

    switch (unit.state) {
        case UnitState.Stand:
            currentAnimation = animations.stand;

            if (unit.controller.move.x != 0 || unit.controller.move.y != 0) {
                unit.state = UnitState.Walk;
                unit.animationTime = 0;
            }

            checkAttack(unit);
            break;

        case UnitState.Walk:
            if (unit.controller.move.x == 0 && unit.controller.move.y == 0) {
                unit.state = UnitState.Stand;
                unit.animationTime = 0;
            }
            else if (mathAbs(unit.controller.move.x) > mathAbs(unit.controller.move.y)) {
                currentAnimation = animations.walkH;
            } else {
                currentAnimation = animations.walkV;
            }

            Vector2.normalize(unit.controller.move);

            unit.position.x += unit.controller.move.x * config.walkSpeed * deltaS;
            unit.position.y += unit.controller.move.y * config.walkSpeed * deltaS;

            checkAttack(unit);
            break;

        case UnitState.Jab:
            currentAnimation = animations.jab;

            if (isAnimationFinished(currentAnimation, unit.animationTime)) {
                if (unit.controller.hand) {
                    unit.state = UnitState.Cross;
                } else {
                    unit.state = UnitState.Stand;
                }
                unit.animationTime = 0;
            }
            break;

        case UnitState.Cross:
            currentAnimation = animations.cross;

            if (isAnimationFinished(currentAnimation, unit.animationTime)) {
                if (!unit.controller.hand) {
                    unit.state = UnitState.Stand;
                    unit.animationTime = 0;
                }
            }
            break;

        case UnitState.Kick:
            currentAnimation = animations.kick;

            if (isAnimationFinished(currentAnimation, unit.animationTime)) {
                unit.state = UnitState.Stand;
                unit.animationTime = 0;
            }
            break;

        case UnitState.Damage:
            currentAnimation = unit.animation || animations.damage1;

            if (isAnimationFinished(currentAnimation, unit.animationTime)) {
                unit.state = UnitState.Stand;
                unit.animationTime = 0;
                unit.animation = undefined;
            }
            break;

        case UnitState.Dead:
            currentAnimation = unit.animation || animations.dead1;

            const duration = animationDuration(currentAnimation);
            if (duration <= unit.animationTime + deltaS) {
                removeUnit(unit);
                currentAnimation = null;
            }
            break;
    }

    unit.position.x += unit.speed.x * deltaS;
    unit.position.y += unit.speed.y * deltaS;

    unit.speed.x *= 0.9;
    unit.speed.y *= 0.9;

    if (unit.controller.move.x > 0) {
        unit.direction = 1;
    } else if (unit.controller.move.x < 0) {
        unit.direction = -1;
    }

    if (currentAnimation) {
        unit.animationTime += deltaS;

        unit.sprite.image = getFrameImage(currentAnimation, unit.animationTime);
        unit.sprite.flipX = unit.direction < 0;

        unit.shadow.image = getColoredImage(unit.sprite.image, 0x55000000);
        unit.shadow.flipX = unit.sprite.flipX;
    }

    unit.damage = 0;
    if (unit.frame != unit.sprite.image) {
        unit.frame = unit.sprite.image;
        unit.damage = config.damages[unit.frame] || 0;
    }
}

export const applyUnitsDamage = () => {
    for (const current of units) {
        if (current.health <= 0) {
            continue;
        }

        if (!current.damage) {
            continue;
        }

        let opponent: Unit | null = null;
        let opponentDistanceX = numberMax;
        let opponentDistanceY = numberMax;

        for (const unit of units) {
            if (unit.health <= 0) {
                continue;
            }

            if (current.config.mob != unit.config.mob) {
                const directionX = unit.position.x - current.position.x;
                if (directionX * current.direction > 0) {
                    const distanceX = mathAbs(directionX);
                    const distanceY = mathAbs(current.position.y - unit.position.y);
                    if (distanceX < 25 && distanceY < 10) {
                        if (!opponent || opponentDistanceX > distanceX || opponentDistanceY > distanceY) {
                            opponent = unit;
                            opponentDistanceX = distanceX;
                            opponentDistanceY = distanceY;
                        }
                    }
                }
            }
        }

        if (opponent) {
            opponent.health -= current.damage;

            opponent.speed.x += current.direction * current.damage / 100 * 300;
            current.speed.x += current.direction * 10;

            const effect = (() => {
                if (current.damage >= 20) {
                    return hitEffect;
                } else {
                    if (chance(0.5)) {
                        return hitRedEffect;
                    } else {
                        return hitMiniEffect;
                    }
                }
            })();

            addEffect(effect, Vector2.add(opponent.position, { x: randomRange(-3, 3), y: randomRange(-14, -18) }));

            if (opponent.health > 0) {
                opponent.state = UnitState.Damage;

                if (opponent.animation != opponent.config.animations.knockdown) {
                    opponent.animationTime = 0;
                }

                opponent.animation = randomSelect([
                    opponent.config.animations.damage1,
                    opponent.config.animations.damage2,
                    opponent.config.animations.knockdown,
                ]);
            } else {
                opponent.state = UnitState.Dead;
                opponent.animation = randomSelect([opponent.config.animations.dead1, opponent.config.animations.dead2]);
                opponent.animationTime = 0;
            }
        }
    }
}

export const updateUnitsSpritePositions = () => {
    for (const unit of units.values()) {
        updateUnitSpritePosition(unit);
    }
}

const updateUnitSpritePosition = (unit: Unit) => {
    const config = unit.config;

    unit.sprite.x = unit.position.x - config.offset.x;
    unit.sprite.y = unit.position.y - config.offset.y;

    const image = images[unit.shadow.image];

    unit.shadow.scaleY = 0.4;
    unit.shadow.x = unit.position.x - config.offset.x + 0;
    unit.shadow.y = unit.position.y - config.offset.y * unit.shadow.scaleY;
}

const checkAttack = (unit: Unit) => {
    if (unit.controller.leg) {
        unit.state = UnitState.Kick;
        unit.animationTime = 0;
    }

    if (unit.controller.hand) {
        unit.state = UnitState.Jab;
        unit.animationTime = 0;
    }

    if (unit.controller.cross) {
        unit.state = UnitState.Cross;
        unit.animationTime = 0;
    }
}