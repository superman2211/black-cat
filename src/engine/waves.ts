import { getHero } from "../game/hero";
import { createMob, mobs, mobsConfigs } from "../game/mob";
import { Box2 } from "../utils/geom";
import { randomRange, randomSelect } from "../utils/math";
import { getStage } from "./stage";

export interface WaveMob {
    config: number,
    count: number,
    reaction: {
        min: number,
        max: number
    },
}

let waves: Array<Array<WaveMob>> = [];

export const initWaves = () => {
    waves = [
        [
            {
                reaction: { min: 1, max: 2 },
                count: 2,
                config: -1
            }
        ],
        [
            {
                reaction: { min: 0.5, max: 1 },
                count: 4,
                config: -1
            }
        ],
        [
            {
                reaction: { min: 0.3, max: 0.7 },
                count: 3,
                config: 1 // bodyguard
            },
            {
                reaction: { min: 0.1, max: 0.3 },
                count: 1,
                config: 0 // boss
            }
        ],
    ];
}

export const generateMobs = () => {
    if (!mobs.length) {
        if (waves.length) {
            const stage = getStage();
            const hero = getHero();

            const zones: Array<Box2> = [];

            const top = 32;
            const bottom = 64;

            zones.push({
                x: stage.bounds.x,
                y: stage.bounds.y + top,
                w: stage.bounds.w,
                h: stage.bounds.h - top - bottom,
            });

            const usualMobsConfigs = [...mobsConfigs];
            usualMobsConfigs.shift();
            usualMobsConfigs.shift();

            const wave = waves.shift()!;

            for (const waveMob of wave) {
                for (let i = 0; i < waveMob.count; i++) {
                    const config = waveMob.config == -1 ? randomSelect(usualMobsConfigs) : mobsConfigs[waveMob.config];

                    const mob = createMob(config);

                    const zone = randomSelect(zones);

                    mob.position.x = zone.x + randomRange(0, zone.w);
                    mob.position.y = zone.y + randomRange(0, zone.h);
                }
            }
        } else {
            // win!
        }
    }
}