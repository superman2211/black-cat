import { getHero } from "../game/hero";
import { createMob, MobData, mobs, mobsConfigs } from "../game/mob";
import { Box2 } from "../utils/geom";
import { lerp, mathMax, mathMin, mathRound, numberMax, randomRange, randomSelect } from "../utils/math";
import { gameWidth } from "./graphics";
import { getStage } from "./stage";

export interface WaveMob {
    config_: number,
    count_: number,
    health_: number,
    walkSpeed_: number,
    reaction_: {
        min_: number,
        max_: number
    },
}

let waves: Array<Array<WaveMob>> = [];

export const initWaves = () => {
    // waves = [
    //     [
    //         {
    //             reaction_: { min_: 1, max_: 2 },
    //             count_: 2,
    //             config_: -1
    //         }
    //     ],
    //     [
    //         {
    //             reaction_: { min_: 0.5, max_: 1 },
    //             count_: 4,
    //             config_: -1
    //         }
    //     ],
    //     [
    //         {
    //             reaction_: { min_: 0.3, max_: 0.7 },
    //             count_: 3,
    //             config_: 1 // bodyguard
    //         },
    //         {
    //             reaction_: { min_: 0.1, max_: 0.3 },
    //             count_: 1,
    //             config_: 0 // boss
    //         }
    //     ],
    // ];

    waves = [];

    const reactionStart = 1;
    const reactionEnd = 0.1;

    const countStart = 3;
    const countEnd = 10;

    const healthStart = 100;
    const healthEnd = 300;

    const walkSpeedStart = 30;
    const walkSpeedEnd = 40;

    const wavesCount = 12;

    for (let i = 0; i < wavesCount; i++) {
        const value = i / (wavesCount - 1);

        const reaction = lerp(reactionStart, reactionEnd, value);
        const count = mathRound(lerp(countStart, countEnd, value) + randomRange(0, 1));
        const health = lerp(healthStart, healthEnd, value);
        const walkSpeed = lerp(walkSpeedStart, walkSpeedEnd, value);

        waves.push(
            [
                {
                    reaction_: { min_: reaction, max_: reaction * 1.2 },
                    count_: count,
                    config_: -1,
                    health_: health,
                    walkSpeed_: walkSpeed,
                }
            ],
        )
    }

    waves.push(
        [
            {
                reaction_: { min_: 0.1, max_: 0.2 },
                count_: 3,
                config_: 1, // bodyguard
                health_: healthEnd,
                walkSpeed_: walkSpeedEnd,
            },
            {
                reaction_: { min_: 0.05, max_: 0.1 },
                count_: 1,
                config_: 0, // boss
                health_: 1000,
                walkSpeed_: walkSpeedEnd,
            }
        ],
    )
}

export const getZones = (): Array<Box2> => {
    const top = 32;
    const bottom = 64;

    const zones: Array<Box2> = [];

    const stage = getStage();

    const leftMin = mathMax(stage.bounds_.x, stage.camera_.x - 30);
    const leftMax = stage.camera_.x;

    const left: Box2 = {
        x: leftMin,
        y: stage.bounds_.y + top,
        w: leftMax - leftMin,
        h: stage.bounds_.h - top - bottom,
    }

    if (left.w > 0) {
        zones.push(left);
    }

    const rightMin = stage.camera_.x + gameWidth;
    const rightMax = mathMin(stage.bounds_.x + stage.bounds_.w, stage.camera_.x + gameWidth + 30);

    const right: Box2 = {
        x: rightMin,
        y: stage.bounds_.y + top,
        w: rightMax - rightMin,
        h: stage.bounds_.h - top - bottom,
    }

    if (right.w > 0) {
        zones.push(right);
    }

    console.log(zones.length);

    return zones;
};

export const generateMobs = () => {
    const zones = getZones();

    if (!zones.length) {
        return;
    }

    if (!mobs.length) {
        if (waves.length) {
            const usualMobsConfigs = [...mobsConfigs];
            usualMobsConfigs.shift();
            usualMobsConfigs.shift();

            const wave = waves.shift()!;

            for (const waveMob of wave) {
                for (let i = 0; i < waveMob.count_; i++) {
                    const config = waveMob.config_ == -1 ? randomSelect(usualMobsConfigs) : mobsConfigs[waveMob.config_];
                    config.health_ = waveMob.health_;
                    config.walkSpeed_ = waveMob.walkSpeed_;

                    const mob = createMob(config);
                    const mobData = mob.custom_ as MobData;
                    mobData.reaction_ = waveMob.reaction_;

                    const zone = randomSelect(zones);

                    mob.position_.x = zone.x + randomRange(0, zone.w);
                    mob.position_.y = zone.y + randomRange(0, zone.h);
                }
            }
        } else {
            // win!
        }
    }
}