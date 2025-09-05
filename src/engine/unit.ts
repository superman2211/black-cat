import { chance, randomRange } from "../utils/math";
import { deltaS } from "../utils/time";
import { animationDuration, AnimationFrame, getFrameImage, isAnimationFinished } from "./animation";

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
        move: { x: number, y: number },
        hand: boolean,
        leg: boolean,
    },
    health: number,
    position: { x: number, y: number },
    animationTime: number,
    image: number,
}

export interface UnitConfig {
    walkSpeed: number,
    animations: {
        stand: Array<AnimationFrame>,
        walk: Array<AnimationFrame>,
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
        position: {
            x: 0,
            y: 0
        },
        animationTime: 0,
        image: 0
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

export const updateUnits = () => {
    for (const unit of units.values()) {
        let currentAnimation = null;

        const config = unit.config;
        const animations = config.animations;

        switch (unit.state) {
            case UnitState.Stand:
                currentAnimation = animations.stand;
                if (unit.controller.move.x != 0) {
                    unit.state = UnitState.Walk;
                    unit.animationTime = 0;
                }

                if (unit.controller.leg) {
                    unit.state = UnitState.Kick;
                    unit.animationTime = 0;
                }

                if (unit.controller.hand) {
                    if (chance(0.5)) {
                        unit.state = UnitState.Jab;
                    } else {
                        unit.state = UnitState.Cross;
                    }

                    unit.animationTime = 0;
                }
                break;

            case UnitState.Walk:
                currentAnimation = animations.walk;
                if (unit.controller.move.x == 0) {
                    unit.state = UnitState.Stand;
                    unit.animationTime = 0;
                }
                break;

            case UnitState.Jab:
                currentAnimation = animations.jab;

                if (isAnimationFinished(currentAnimation, unit.animationTime)) {
                    unit.state = UnitState.Stand;
                    unit.animationTime = 0;
                }
                break;

            case UnitState.Cross:
                currentAnimation = animations.cross;

                if (isAnimationFinished(currentAnimation, unit.animationTime)) {
                    unit.state = UnitState.Stand;
                    unit.animationTime = 0;
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

        unit.position.x += unit.controller.move.x * config.walkSpeed * deltaS;

        if (currentAnimation) {
            unit.animationTime += deltaS;
            unit.image = getFrameImage(currentAnimation, unit.animationTime);
        }
    }
}