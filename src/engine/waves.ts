import { DEBUG } from "../debug";
import { createMob, MobData, mobs, mobsConfigs, setAttackers } from "../game/mob";
import { playWin } from "../resources/sound/audio";
import { cloneObject } from "../utils/browser";
import { Box2 } from "../utils/geom";
import { lerp, mathMax, mathMin, mathRound, randomRange, randomSelect } from "../utils/math";
import { game, GameState } from "./game";
import { gameWidth } from "./graphics";
import { getStage } from "./stage";
import { UnitConfig, units } from "./unit";

export interface WaveMob {
    config: number,
    count: number,
    health: number,
    walkSpeed: number,
    reaction: {
        min: number,
        max: number
    },
}

export interface Wave {
    mobs: Array<WaveMob>,
    attackers: number,
}

let waves: Array<Wave> = [];

export const getLevel = (): number => 13 - waves.length;

export const lastLevel = () => {
    if (DEBUG) {
        // while (waves.length > 1) {
        waves.shift();
        // }
    }
}

export const initWaves = () => {
    waves = [];

    const reactionStart = 2;
    const reactionEnd = 1;

    const countStart = 2;
    const countEnd = 5;

    const healthStart = 100;
    const healthEnd = 150;

    const walkSpeedStart = 30;
    const walkSpeedEnd = 35;

    const attackersStart = 1;
    const attackersEnd = 3;

    const wavesCount = 12;

    for (let i = 0; i < wavesCount; i++) {
        const value = i / (wavesCount - 1);

        const reaction = lerp(reactionStart, reactionEnd, value);
        const count = mathRound(lerp(countStart, countEnd, value));
        const health = mathRound(lerp(healthStart, healthEnd, value));
        const walkSpeed = lerp(walkSpeedStart, walkSpeedEnd, value);
        const attackers = mathRound(lerp(attackersStart, attackersEnd, value));

        waves.push(
            {
                attackers: attackers,
                mobs: [
                    {
                        reaction: { min: reaction, max: reaction * 1.2 },
                        count: count,
                        config: -1,
                        health: health,
                        walkSpeed: walkSpeed,
                    }
                ],
            }
        )
    }

    waves.push(
        {
            attackers: attackersEnd,
            mobs: [
                {
                    reaction: { min: reactionEnd, max: reactionEnd * 1.2 },
                    count: 3,
                    config: 1, // bodyguard
                    health: healthEnd,
                    walkSpeed: walkSpeedEnd,
                },
                {
                    reaction: { min: reactionEnd, max: reactionEnd * 1.2 },
                    count: 1,
                    config: 0, // boss
                    health: 500,
                    walkSpeed: walkSpeedEnd,
                }
            ],
        }
    )
}

const names = ["bob", "jay", "jack", "serg", "alex", "john", "mike", "buba", "val", "noah", "levi", "leo", "alan", "ben", "kyle", "ivan", "peter"];

export const getZones = (): Array<Box2> => {
    const top = 32;
    const bottom = 64;

    const zones: Array<Box2> = [];

    const stage = getStage();

    const leftMin = mathMax(stage.bounds.x, stage.camera.x - 30);
    const leftMax = stage.camera.x;

    const left: Box2 = {
        x: leftMin,
        y: stage.bounds.y + top,
        w: leftMax - leftMin,
        h: stage.bounds.h - top - bottom,
    }

    if (left.w > 0) {
        zones.push(left);
    }

    const rightMin = stage.camera.x + gameWidth;
    const rightMax = mathMin(stage.bounds.x + stage.bounds.w, stage.camera.x + gameWidth + 30);

    const right: Box2 = {
        x: rightMin,
        y: stage.bounds.y + top,
        w: rightMax - rightMin,
        h: stage.bounds.h - top - bottom,
    }

    if (right.w > 0) {
        zones.push(right);
    }

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

            setAttackers(wave.attackers);

            for (const waveMob of wave.mobs) {
                for (let i = 0; i < waveMob.count; i++) {
                    const config: UnitConfig = cloneObject(waveMob.config == -1 ? randomSelect(usualMobsConfigs) : mobsConfigs[waveMob.config]);
                    config.health = waveMob.health;
                    config.walkSpeed = waveMob.walkSpeed;
                    if (waveMob.config == 0) {
                        config.name = "boss";
                    } else {
                        config.name = randomSelect(names);
                    }

                    const mob = createMob(config);
                    const mobData = mob.custom as MobData;
                    mobData.reaction = waveMob.reaction;

                    const zone = randomSelect(zones);

                    mob.position.x = zone.x + randomRange(0, zone.w);
                    mob.position.y = zone.y + randomRange(0, zone.h);
                }
            }
        } else {
            if (units.length == 1) {
                game.state = GameState.GameWin;
                playWin();
            }
        }
    }
}