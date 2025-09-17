import { getColoredImage } from "../resources/images";
import { playHit, playKick, playWhoosh } from "../resources/sound/audio";
import { Vector2 } from "../utils/geom";
import { chance, limit, mathAbs, numberMax, randomChancesSelect, randomRange, randomSelect } from "../utils/math";
import { deltaS } from "../utils/time";
import { animationDuration, AnimationFrame, getFrameImage, isAnimationFinished } from "./animation";
import { addEffect, hitEffect, hitMiniEffect, hitRedEffect } from "./effect";
import { entities, removeEntity } from "./entity";
import { Sprite } from "./sprite";
import { getStage } from "./stage";

export const units: Array<Unit> = [];

export const enum UnitState {
    Stand,
    Walk,
    Attack,
    Damage,
    Dead,
}

export interface Unit {
    config: UnitConfig,
    state: UnitState,
    controller: {
        move: Vector2,
        attack: boolean,
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
    custom: any,
}

export interface UnitConfig {
    mob: boolean,
    name: string,
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
        sit: Array<AnimationFrame>,
    },
    damages: { [key: number]: number },
}

export const addUnit = (config: UnitConfig): Unit => {
    let unit: Unit = {
        config: config,
        state: UnitState.Stand,
        controller: {
            move: {
                x: 0,
                y: 0
            },
            attack: false,
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
            image: -1,
        },
        shadow: {
            image: -1,
        },
        damage: 0,
        frame: 0,
        custom: null,
    };

    units.push(unit);
    entities.push(unit);

    return unit;
}

export const removeUnit = (unit: Unit) => {
    const index = units.indexOf(unit);
    if (index != -1) {
        units.splice(index, 1);
    }
    removeEntity(unit);
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

        case UnitState.Attack:
            currentAnimation = unit.animation || animations.jab;

            if (isAnimationFinished(currentAnimation, unit.animationTime)) {
                unit.state = UnitState.Stand;
                unit.animationTime = 0;
                unit.animation = undefined;
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
            if (unit.health <= 0 || unit.animation == unit.config.animations.knockdown) {
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
                    playKick();
                    return hitEffect;
                } else {
                    playHit();
                    if (chance(0.5)) {
                        return hitRedEffect;
                    } else {
                        return hitMiniEffect;
                    }
                }
            })();

            addEffect(effect, Vector2.add(opponent.position, { x: randomRange(-3, 3), y: randomRange(-14, -18) }));

            const animations = opponent.config.animations;

            if (opponent.health > 0) {
                opponent.state = UnitState.Damage;

                opponent.animationTime = 0;

                opponent.animation = randomChancesSelect([
                    animations.damage1,
                    animations.damage2,
                    animations.knockdown,
                ], [10, 10, 1]);
            } else {
                opponent.state = UnitState.Dead;
                opponent.animation = randomSelect([animations.dead1, animations.dead2]);
                opponent.animationTime = 0;

                if (opponent.config.mob) {
                    // playEnemyKilled();
                }
            }
        } else {
            if (!current.config.mob) {
                playWhoosh();
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

    unit.shadow.scaleY = 0.4;
    unit.shadow.x = unit.position.x - config.offset.x + 0;
    unit.shadow.y = unit.position.y - config.offset.y * unit.shadow.scaleY;
}

const checkAttack = (unit: Unit) => {
    if (unit.controller.attack) {
        const animations = unit.config.animations;
        unit.state = UnitState.Attack;
        unit.animation = randomSelect([animations.jab, animations.cross, animations.kick]);
        unit.animationTime = 0;
    }
}