import { AnimationFrame } from "../engine/animation";
import { getStage } from "../engine/stage";
import { addUnit, Unit, UnitConfig, units, UnitState } from "../engine/unit";
import { man0, man1, man10, man11, man12, man2, man3, man4, man5, man6, man7, man8, man9, man13, man14, man15, man16, man17, man18, man19, man20, man21, man22 } from "../resources/id";
import { addImage, images } from "../resources/images";
import { cloneObject } from "../utils/browser";
import { Vector2 } from "../utils/geom";
import { applyPallette, cloneCanvas } from "../utils/image";
import { chance, limit, mathAbs, mathCos, mathPI, mathPI2, mathRandom, mathSin, numberMax, randomRange, randomSelect } from "../utils/math";
import { deltaS } from "../utils/time";
import { getHero, HeroSlot, heroSlots } from "./hero";

interface MobData {
    reaction: { min: number, max: number },
    reactionTimeout: number,
    reactionTime: number,
    target: Vector2,
};

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
    },
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

    for (let i = 0; i < 10; i++) {
        let hair = randomSelect(hairs);
        const face = randomSelect(skins);
        const shirt = randomSelect(shirts);
        const pant = randomSelect(pants);
        const shoe = randomSelect(shoes);

        let body = shirt;
        let hand0 = shirt;
        let hand1 = shirt;
        let hand2 = face;

        let legs0 = pant;
        let legs1 = pant;

        // blind
        if (chance(0.1)) {
            hair = face;
        }

        // short shirt
        if (chance(0.5)) {
            hand1 = face;
        }

        // gloves
        if (chance(0.2)) {
            hand2 = 0xff111111;
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
            shoe, // legs2
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

    for (const image in newConfig.damages) {
        const newImage = getPalletteImage(Number(image), pallette, targetPallette, id);
        newConfig.damages[newImage] = newConfig.damages[image];
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
    const mobData: MobData = {
        reaction: {
            min: 1,
            max: 2,
        },
        reactionTimeout: 0,
        reactionTime: 0,
        target: { x: 0, y: 0 },
    };
    mob.custom = mobData;
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

const fightDistanceX = 18;
const fightDistanceY = 5;
const safeDistance = 30;

const updateMob = (mob: Unit, hero: Unit) => {
    if (units.indexOf(mob) == -1) {
        removeMob(mob);
    }

    if (mob.health <= 0) {
        return;
    }

    mob.controller.move.x = 0;
    mob.controller.move.y = 0;
    mob.controller.attack = false;

    const mobData = mob.custom as MobData;

    let brainActive = false;

    mobData.reactionTime += deltaS;
    if (mobData.reactionTime > mobData.reactionTimeout) {
        mobData.reactionTime = 0;
        mobData.reactionTimeout = randomRange(mobData.reaction.min, mobData.reaction.max);
        brainActive = true;
    }

    // switch (mob.state) {
    //     case UnitState.Walk:
    //     case UnitState.Stand:
    //         const slot = heroSlots.find((s) => s.mob == mob);
    //         if (slot) {
    //             const slotPosition = Vector2.add(slot.position, hero.position);
    //             const direction = Vector2.subtract(slotPosition, mob.position);
    //             const distance = Vector2.length(direction);

    //             if (brainActive) {
    //                 if (mathAbs(direction.x) < fightDistanceX && mathAbs(direction.y) < fightDistanceY) {
    //                     mob.controller.attack = true;
    //                 }
    //             }

    //             if (distance > mob.config.walkSpeed * deltaS) {
    //                 Vector2.normalize(direction);
    //                 mob.controller.move.x = direction.x;
    //                 mob.controller.move.y = direction.y;
    //             }

    //             // if (brainActive) {
    //             //     delete slot.mob;
    //             // }
    //         } else {
    //             if (brainActive) {
    //                 console.log("active");
    //                 let nearestSlot: HeroSlot | undefined;
    //                 let nearestSlotDistance = numberMax;

    //                 for (const slot of heroSlots) {
    //                     if (!slot.mob) {
    //                         const slotDistance = Vector2.distance(mob.position, slot.position);

    //                         if (nearestSlotDistance > slotDistance) {
    //                             nearestSlotDistance = slotDistance;
    //                             nearestSlot = slot;
    //                         }
    //                     }
    //                 }

    //                 if (nearestSlot) {
    //                     nearestSlot.mob = mob;
    //                 }
    //             }
    //         }
    //         break;
    // }

    // if (mob.state == UnitState.Stand || mob.state == UnitState.Walk) {
    //     if (onFightDistance(mob, hero)) {
    //         if (brainActive) {
    //             mob.direction = limit(-1, 1, hero.position.x - mob.position.x);
    //             mob.controller.attack = true;
    //         }
    //     } else {
    //         const mobsAround = mobs.filter((m) => onFightDistance(m, hero));

    //         if (mobsAround.length < 4) {
    //             if (brainActive) {
    //                 for (const slot of heroSlots) {
    //                     const slotPosition = Vector2.add(hero.position, slot.position);
    //                     if (!mobsAround.filter((m) => Vector2.distance(slotPosition, m.position) < 5).length) {
    //                         mobData.target.x = slotPosition.x;
    //                         mobData.target.y = slotPosition.y;
    //                     }
    //                 }

    //             }
    //         }

    //         const direction = Vector2.subtract(mobData.target, mob.position);
    //         Vector2.normalize(direction);
    //         mob.controller.move.x = direction.x;
    //         mob.controller.move.y = direction.y;
    //     }
    // }
}

const onFightDistance = (mob: Unit, hero: Unit): boolean => {
    const direction = Vector2.subtract(hero.position, mob.position);
    return mathAbs(direction.x) < fightDistanceX && mathAbs(direction.y) < fightDistanceY;

}

export const generateMobs = () => {
    if (mobs.length < 4) {
        const hero = getHero();

        const config = randomSelect(configs);

        const mob = createMob(config);
        mob.position.x = hero.position.x + randomRange(-50, 50);
        mob.position.y = hero.position.y + randomRange(-50, 50);
    }
}