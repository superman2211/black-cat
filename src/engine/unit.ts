import { getColoredImage, images } from "../resources/images";
import { Vector2 } from "../utils/geom";
import { chance, limit, mathHypot, mathRound, randomRange } from "../utils/math";
import { deltaS } from "../utils/time";
import { animationDuration, AnimationFrame, getFrameImage, isAnimationFinished } from "./animation";
import { Sprite } from "./sprite";
import { getStage } from "./stage";

export const units: Array<Unit> = [];

export const enum UnitState {
    Stand,
    Walk,
    Jab,
    Cross,
    Kick,
}

export interface Unit {
    config: UnitConfig,
    state: UnitState,
    controller: {
        move: Vector2,
        hand: boolean,
        leg: boolean,
    },
    health: number,
    direction: number,
    position: Vector2,
    animationTime: number,
    sprite: Sprite,
    shadow: Sprite,
}

export interface UnitConfig {
    walkSpeed: number,
    offset: Vector2,
    animations: {
        stand: Array<AnimationFrame>,
        walkH: Array<AnimationFrame>,
        walkV: Array<AnimationFrame>,
        jab: Array<AnimationFrame>,
        cross: Array<AnimationFrame>,
        kick: Array<AnimationFrame>,
    }
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
            leg: false
        },
        health: 0,
        direction: 1,
        position: {
            x: 0,
            y: 0
        },
        animationTime: 0,
        sprite: {
            image: 0,
        },
        shadow: {
            image: 0,
        }
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

export const collideUnits = () => {
    const minDistance = 5;

    for (let i = 0; i < units.length; i++) {
        const unit0 = units[i];
        for (let j = i + 1; j < units.length; j++) {
            const unit1 = units[j];

            let direction = Vector2.subtract(unit0.position, unit1.position);

            if (direction.x == 0 && direction.y == 0) {
                direction.x = 1;
            }

            const distance = Vector2.length(direction);

            if (distance < minDistance) {
                const scale = (minDistance - distance) / distance;
                const offset = Vector2.scale(direction, scale);

                unit0.position.x += offset.x;
                unit0.position.y += offset.y;

                unit1.position.x -= offset.x;
                unit1.position.y -= offset.y;
            }
        }
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
            if (unit.controller.move.x != 0) {
                currentAnimation = animations.walkH;
            } else if (unit.controller.move.y != 0) {
                currentAnimation = animations.walkV;
            } else {
                unit.state = UnitState.Stand;
                unit.animationTime = 0;
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
    }

    if (unit.controller.move.x > 0) {
        unit.direction = 1;
    } else if (unit.controller.move.x < 0) {
        unit.direction = -1;
    }

    if (currentAnimation) {
        unit.animationTime += deltaS;

        unit.sprite.image = getFrameImage(currentAnimation, unit.animationTime);
        unit.sprite.flipX = unit.direction < 0;

        // if (unit.config.animations.walkH.length == 1) {
        //     console.log(unit.animationTime, currentAnimation.length, unit.sprite.image);
        // }

        unit.shadow.image = getColoredImage(unit.sprite.image, 0x55000000);
        unit.shadow.flipX = unit.sprite.flipX;
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
}