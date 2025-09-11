import { AnimationFrame } from "../engine/animation";
import { getStage } from "../engine/stage";
import { addUnit, Unit, UnitConfig, units, UnitState } from "../engine/unit";
import { man0, man1, man10, man11, man12, man2, man3, man4, man5, man6, man7, man8, man9, man13, man14, man15, man16, man17, man18, man19, man20, man21, man22 } from "../resources/id";
import { addImage, images } from "../resources/images";
import { cloneObject } from "../utils/browser";
import { Vector2 } from "../utils/geom";
import { applyPallette, cloneCanvas } from "../utils/image";
import { chance, mathRandom, randomRange, randomSelect } from "../utils/math";
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
        damage1: [
            { image: man14, time: 0.5 },
            { image: man13, time: 0.3 },
        ],
        damage2: [
            { image: man18, time: 0.5 },
            { image: man17, time: 0.3 },
        ],
        knockdown: [
            { image: man13, time: 0.2 },
            { image: man14, time: 0.5 },
            { image: man15, time: 1.0 },
            { image: man16, time: 0.3 },
            { image: man17, time: 0.2 },
        ],
        dead1: [
            { image: man18, time: 0.2 },
            { image: man19, time: 0.2 },
            { image: man20, time: 0.2 },
            { image: man21, time: 1.0 },
            { image: -1, time: 0.2 },
            { image: man21, time: 0.2 },
            { image: -1, time: 0.2 },
            { image: man21, time: 0.2 },
            { image: -1, time: 0.2 },
            { image: man21, time: 0.2 },
        ],
        dead2: [
            { image: man13, time: 0.2 },
            { image: man14, time: 0.5 },
            { image: man15, time: 1.0 },
            { image: -1, time: 0.2 },
            { image: man15, time: 0.2 },
            { image: -1, time: 0.2 },
            { image: man15, time: 0.2 },
            { image: -1, time: 0.2 },
            { image: man15, time: 0.2 },
        ],
        sit: [
            { image: man22, time: 0.0 },
        ]
    },
    damages: {
        [man6]: 5, // jab
        [man8]: 10, // cross
        [man12]: 20, // kick
    }
};

const configs: Array<UnitConfig> = [];

export const randomMobConfig = (): UnitConfig => randomSelect(configs);

export const generateMobsConfigs = () => {
    // const pallette = getPallette(images[man0]);
    // for (const color of pallette) {
    //     console.log(`0x${color.toString(16)}`);
    // }

    // boss
    generateConfig([
        0xff000000, // hair
        0xffff9300, // face
        0xffaaaaaa, // body
        0xffffffff, // hand0
        0xffffffff, // hand1
        0xffff9300, // hand2
        0xff666666, // legs0
        0xff666666, // legs1
        0xff000000 // legs2
    ]);

    // bodyguard
    generateConfig([
        0xff000000, // hair
        0xffff9300, // face
        0xff111111, // body
        0xff111111, // hand0
        0xff111111, // hand1
        0xffff9300, // hand2
        0xff111111, // legs0
        0xff111111, // legs1
        0xff000000 // legs2
    ]);

    const hairs = [0xff090806, 0xff9B6C4C, 0xffA95942];
    const skins = [0xffE7C2AA, 0xffC99073, 0xffE1BA91, 0xffBC8663, 0xff553D2D];
    const shirts = [0xff333333, 0xff2E4A57, 0xff005493];
    const pants = [0xff000033, 0xff797B8B, 0xff005493, 0xff003F24];
    const shoes = [0xff000000, 0xffEBEBEB, 0xff270C01];

    for (let i = 0; i < 5; i++) {
        const hair = randomSelect(hairs);
        const face = randomSelect(skins);
        const shirt = randomSelect(shirts);
        const pant = randomSelect(pants);
        const legs2 = randomSelect(shoes);

        let body = shirt;
        let hand0 = shirt;
        let hand1 = shirt;
        let hand2 = face;

        let legs0 = pant;
        let legs1 = pant;

        // short shirt
        if (chance(0.5)) {
            hand1 = face;
        }

        // gloves
        if (chance(0.5)) {
            hand2 = 0xff000000;
        }

        // short pants
        if (chance(0.5)) {
            legs1 = face;
        }

        generateConfig([
            hair, // hair
            face, // face
            body, // body
            hand0, // hand0
            hand1, // hand1
            hand2, // hand2
            legs0, // legs0
            legs1, // legs1
            legs2, // legs2
        ]);
    }
}

const generateConfig = (targetPallette: number[]) => {
    const newConfig: UnitConfig = cloneObject(config);

    newConfig.walkSpeed = randomRange(10, 20);

    const id = configs.length;

    const animations = newConfig.animations as any;
    for (const name in animations) {
        const animation = animations[name] as Array<AnimationFrame>;
        replaceImagesPallette(animation, pallette, targetPallette, id);
    }

    configs.push(newConfig);
}

const replaceImagesPallette = (animation: Array<AnimationFrame>, sourcePallette: Array<number>, targetPallette: Array<number>, palletteId: number) => {
    for (const frame of animation) {
        frame.image = getPalletteImage(frame.image, sourcePallette, targetPallette, palletteId);
    }
}

const imagesPallete: { [key: string]: number } = {};
const getPalletteImage = (id: number, sourcePallette: Array<number>, targetPallette: Array<number>, palletteId: number) => {
    if (id == -1) return -1;

    const key = `${id}_${palletteId}`;
    if (!imagesPallete[key]) {
        const target = cloneCanvas(images[id]);
        applyPallette(target, sourcePallette, targetPallette);
        imagesPallete[key] = addImage(target);
    }
    return imagesPallete[key];
}

export const createMob = (config: UnitConfig): Unit => {
    const mob = addUnit(config);
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
    if (units.indexOf(mob) == -1) {
        removeMob(mob);
    }

    return;

    if (mob.health <= 0) {
        return;
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

export const generateMobs = () => {
    if (mobs.length < 2) {
        const hero = getHero();

        const config = randomSelect(configs);

        const mob = createMob(config);
        mob.position.x = hero.position.x + randomRange(-50, 50);
        mob.position.y = hero.position.y + randomRange(-50, 50);
    }
}