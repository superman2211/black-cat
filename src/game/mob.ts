import { AnimationFrame } from "../engine/animation";
import { addUnit, Unit, UnitConfig, units, UnitState } from "../engine/unit";
import { man0, man1, man10, man11, man12, man2, man3, man4, man5, man6, man7, man8, man9, man13, man14, man15, man16, man17 } from "../resources/id";
import { addImage, images } from "../resources/images";
import { cloneObject } from "../utils/browser";
import { Vector2 } from "../utils/geom";
import { applyPallette, cloneCanvas } from "../utils/image";
import { chance, mathRandom, randomRange } from "../utils/math";
import { getHero } from "./hero";

export const mobs: Array<Unit> = [];

const pallette = [
    0xff000000, // hair
    0xffff9300, // face
    0xff942192, // body
    0xffaa7942, // hand0
    0xff5e0e01, // hand1
    0xffbf6d5e, // hand2
    0xff006500, // legs0
    0xff006a6b, // legs1
    0xff01187d, // legs2
];

const config: UnitConfig = {
    mob: true,
    health: 100,
    walkSpeed: 20,
    offset: { x: 16, y: 31 },
    animations: {
        stand: [
            { image: man0, time: 0.3 },
            { image: man1, time: 0.3 },
            { image: man0, time: 0.3 },
            { image: man2, time: 0.3 },
            { image: man3, time: 0.3 },
            { image: man2, time: 0.3 },
        ],
        walkH: [
            { image: man0, time: 0.2 },
            { image: man4, time: 0.2 },
            { image: man0, time: 0.2 },
            { image: man5, time: 0.2 },
        ],
        walkV: [
            { image: man0, time: 0.2 },
            { image: man9, time: 0.2 },
            { image: man0, time: 0.2 },
            { image: man10, time: 0.2 },
        ],
        jab: [
            { image: man0, time: 0.2 },
            { image: man6, time: 0.2 },
        ],
        cross: [
            { image: man6, time: 0.2 },
            { image: man7, time: 0.2 },
            { image: man8, time: 0.2 },
            { image: man7, time: 0.2 },
        ],
        kick: [
            { image: man0, time: 0.2 },
            { image: man11, time: 0.2 },
            { image: man12, time: 0.2 },
            { image: man11, time: 0.2 },
        ],
        damage: [
            { image: man13, time: 0.5 },
            { image: man0, time: 0.1 },
        ],
        dead: [
            { image: man0, time: 0.1 },
            { image: man13, time: 0.2 },
            { image: man14, time: 0.2 },
            { image: man15, time: 0.2 },
            { image: man16, time: 0.3 },
            { image: man17, time: 5.0 },
        ]
    },
    damages: {
        [man6]: 10, // jab
        [man8]: 20, // cross
        [man12]: 30, // kick
    }
};

const configs: Array<UnitConfig> = [];

export const generateMobsConfigs = () => {
    // const pallette = getPallette(images[man0]);
    // for (const color of pallette) {
    //     console.log(`0x${color.toString(16)}`);
    // }

    configs.push(generateConfig([
        0xff000000, // hair
        0xffff9300, // face
        0xff333333, // body
        0xff333333, // hand0
        0xff999999, // hand1
        0xffff9300, // hand2
        0xff000033, // legs0
        0xff000033, // legs1
        0xff000000, // legs2
    ], "bob"));

    configs.push(generateConfig([
        0xff000000, // hair
        0xffff9300, // face
        0xff71B8D5, // body
        0xffff9300, // hand0
        0xffff9300, // hand1
        0xff000000, // hand2
        0xff797B8B, // legs0
        0xff797B8B, // legs1
        0xff000000 // legs2
    ], "jack"));
}

const generateConfig = (targetPallette: number[], palletteName: string): UnitConfig => {
    const newConfig: UnitConfig = cloneObject(config);

    newConfig.walkSpeed = randomRange(10, 20);

    const animations = newConfig.animations as any;
    for (const name in animations) {
        const animation = animations[name] as Array<AnimationFrame>;
        replaceImagesPallette(animation, pallette, targetPallette, palletteName);
    }

    return newConfig;
}

const replaceImagesPallette = (animation: Array<AnimationFrame>, sourcePallette: Array<number>, targetPallette: Array<number>, palletteName: string) => {
    for (const frame of animation) {
        frame.image = getPalletteImage(frame.image, sourcePallette, targetPallette, palletteName);
    }
}

const imagesPallete: { [key: string]: number } = {};
const getPalletteImage = (id: number, sourcePallette: Array<number>, targetPallette: Array<number>, palletteName: string) => {
    const key = `${id}_${palletteName}`;
    if (!imagesPallete[key]) {
        const target = cloneCanvas(images[id]);
        applyPallette(target, sourcePallette, targetPallette);
        imagesPallete[key] = addImage(target);
    }
    return imagesPallete[key];
}

export const createMob = (index: number): Unit => {
    const mob = addUnit(configs[index]);
    mobs.push(mob);
    return mob;
}

export const clearMobs = () => {
    mobs.splice(0, mobs.length);
}

export const removeMob = (mob: Unit) => {
    const index = mobs.indexOf(mob);
    if (index != -1) {
        mobs.splice(index, 1);
    }
}

export const updateMobs = () => {
    const hero = getHero();

    for (const mob of mobs) {
        updateMob(mob, hero);
    }
}

const updateMob = (mob: Unit, hero: Unit) => {
    if (mob.health <= 0) {
        return;
    }

    if (units.indexOf(mob) == -1) {
        removeMob(mob);
    }

    mob.controller.move.x = 0;
    mob.controller.move.y = 0;
    mob.controller.leg = false;
    mob.controller.hand = false;
    mob.controller.cross = false;

    const fightDistance = 15;

    if (mob.state == UnitState.Stand || mob.state == UnitState.Walk) {
        const direction = Vector2.subtract(hero.position, mob.position);
        const distance = Vector2.length(direction);

        if (distance > fightDistance) {
            Vector2.normalize(direction);
            mob.controller.move.x = direction.x;
            mob.controller.move.y = direction.y;
        } else {
            mob.controller.move.x = 0;
            mob.controller.move.y = 0;

            const rnd = mathRandom();
            if (rnd < 0.5) {
                mob.controller.hand = true;
            } else if (rnd < 0.8) {
                mob.controller.cross = true;
            } else {
                mob.controller.leg = true;
            }
        }
    }
}

export const collideMobs = () => {
    const minDistance = 10;

    for (let i = 0; i < mobs.length; i++) {
        const unit0 = mobs[i];

        if (unit0.health <= 0) {
            continue;
        }

        for (let j = i + 1; j < mobs.length; j++) {
            const unit1 = mobs[j];

            if (unit1.health <= 0) {
                continue;
            }

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


