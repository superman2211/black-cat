import { AnimationFrame } from "../engine/animation";
import { addUnit, Unit, UnitConfig } from "../engine/unit";
import { man0, man1, man10, man11, man12, man2, man3, man4, man5, man6, man7, man8, man9 } from "../resources/id";
import { addImage, images } from "../resources/images";
import { cloneObject } from "../utils/browser";
import { applyPallette, cloneCanvas } from "../utils/image";

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
    walkSpeed: 30,
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
        ]
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

export const updateMobs = () => {
    for (const mob of mobs) {
        mob.controller.move.x = 0;
        mob.controller.move.y = 0;
        mob.controller.leg = false;
        mob.controller.hand = false;

        // if (isKeyPressed(Key.Left) || isKeyPressed(Key.A)) {
        //     mob.controller.move.x = -1;
        // }

        // if (isKeyPressed(Key.Right) || isKeyPressed(Key.D)) {
        //     mob.controller.move.x = 1;
        // }

        // if (isKeyPressed(Key.Up) || isKeyPressed(Key.W)) {
        //     mob.controller.move.y = -1;
        // }

        // if (isKeyPressed(Key.Down) || isKeyPressed(Key.S)) {
        //     mob.controller.move.y = 1;
        // }

        // if (isKeyPressed(Key.Z)) {
        //     mob.controller.leg = true;
        // }

        // if (isKeyPressed(Key.X)) {
        //     mob.controller.hand = true;
        // }
    }
}


