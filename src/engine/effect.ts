import { hit0, hit1, hit2, hitMini0, hitMini1, hitMini2, hitRed0, hitRed1, hitRed2 } from "../resources/id";
import { Vector2 } from "../utils/geom";
import { deltaS } from "../utils/time";
import { animationDuration, AnimationFrame, getFrameImage } from "./animation";
import { Sprite } from "./sprite";

export const effects: Array<Effect> = [];

export interface Effect {
    sprite: Sprite,
    animation: Array<AnimationFrame>,
    animationTime: number,
}

export interface EffectConfig {
    animation: Array<AnimationFrame>,
    offset: Vector2,
}

export const hitEffect: EffectConfig = {
    animation: [
        { image: hit0, time: 0.2 },
        { image: hit1, time: 0.2 },
        { image: hit2, time: 0.2 },
    ],
    offset: { x: 16, y: 16 }
}

export const hitMiniEffect: EffectConfig = {
    animation: [
        { image: hitMini0, time: 0.2 },
        { image: hitMini1, time: 0.2 },
        { image: hitMini2, time: 0.2 },
    ],
    offset: { x: 8, y: 8 }
}

export const hitRedEffect: EffectConfig = {
    animation: [
        { image: hitRed0, time: 0.2 },
        { image: hitRed1, time: 0.2 },
        { image: hitRed2, time: 0.2 },
    ],
    offset: { x: 8, y: 8 }
}

export const removeEffect = (effect: Effect) => {
    const index = effects.indexOf(effect);
    if (index != -1) {
        effects.splice(index, 1);
    }
}

export const addEffect = (config: EffectConfig, position: Vector2) => {
    effects.push({
        animation: config.animation,
        animationTime: 0,
        sprite: {
            image: 0,
            x: position.x - config.offset.x,
            y: position.y - config.offset.y
        }
    });
}

export const updateEffects = () => {
    for (const effect of effects) {
        const duration = animationDuration(effect.animation);
        effect.animationTime += deltaS;
        if (effect.animationTime > duration) {
            removeEffect(effect);
        } else {
            effect.sprite.image = getFrameImage(effect.animation, effect.animationTime);
        }
    }
}