import { isKeyPressed, Key } from "../engine/input";
import { addUnit, Unit, UnitConfig, UnitState } from "../engine/unit";
import { kate0, kate1, kate10, kate11, kate12, kate13, kate2, kate3, kate4, kate5, kate6, kate7, kate8, kate9 } from "../resources/id";
import { Vector2 } from "../utils/geom";

export interface HeroSlot {
    position: Vector2,
    mob?: Unit
}

export const heroSlots: Array<HeroSlot> = [
    { position: { x: -14, y: -2 } },
    { position: { x: 14, y: -2 } },
    { position: { x: 18, y: 4 } },
    { position: { x: -18, y: 4 } },
];

const config: UnitConfig = {
    mob: false,
    health: 1000,
    walkSpeed: 30,
    offset: { x: 16, y: 29 },
    animations: {
        stand: [
            { image: kate0, time: 0.2 },
            { image: kate1, time: 0.2 },
            { image: kate2, time: 0.2 },
            { image: kate1, time: 0.2 },
            { image: kate0, time: 0.2 },
            { image: kate3, time: 0.2 },
        ],
        walkH: [
            { image: kate0, time: 0.1 },
            { image: kate4, time: 0.1 },
            { image: kate5, time: 0.1 },
            { image: kate4, time: 0.1 },
        ],
        walkV: [
            { image: kate11, time: 0.1 },
            { image: kate12, time: 0.1 },
            { image: kate11, time: 0.1 },
            { image: kate13, time: 0.1 },
        ],
        jab: [
            { image: kate0, time: 0.05 },
            { image: kate8, time: 0.1 },
        ],
        cross: [
            { image: kate8, time: 0.1 },
            { image: kate9, time: 0.1 },
            { image: kate10, time: 0.1 },
            { image: kate9, time: 0.1 },
        ],
        kick: [
            { image: kate0, time: 0.05 },
            { image: kate6, time: 0.05 },
            { image: kate7, time: 0.1 },
            { image: kate6, time: 0.1 },
        ],
        damage1: [
            { image: kate0, time: 0.3 },
        ],
        damage2: [
            { image: kate0, time: 0.3 },
        ],
        knockdown: [
            { image: kate0, time: 0.3 },
        ],
        dead1: [
            { image: kate0, time: 1.0 },
        ],
        dead2: [
            { image: kate0, time: 1.0 },
        ],
        sit: []
    },
    damages: {
        [kate8]: 10, // jab
        [kate10]: 20, // cross
        [kate7]: 30, // kick
    },
};

let hero: Unit | undefined;

export const createHero = () => {
    hero = addUnit(config);
}

export const getHero = (): Unit => {
    return hero!;
}

export const updateHero = () => {
    if (!hero) {
        return;
    }

    if (hero.health <= 0) {
        return;
    }

    for (const slot of heroSlots) {
        if (slot.mob) {
            switch (slot.mob.state) {
                case UnitState.Dead:
                case UnitState.Damage:
                    delete slot.mob;
                    break;
            }

        }
    }

    hero.controller.move.x = 0;
    hero.controller.move.y = 0;
    hero.controller.attack = false;

    if (isKeyPressed(Key.Left) || isKeyPressed(Key.A)) {
        hero.controller.move.x = -1;
    }

    if (isKeyPressed(Key.Right) || isKeyPressed(Key.D)) {
        hero.controller.move.x = 1;
    }

    if (isKeyPressed(Key.Up) || isKeyPressed(Key.W)) {
        hero.controller.move.y = -1;
    }

    if (isKeyPressed(Key.Down) || isKeyPressed(Key.S)) {
        hero.controller.move.y = 1;
    }

    if (isKeyPressed(Key.Space) || isKeyPressed(Key.X) || isKeyPressed(Key.Z)) {
        hero.controller.attack = true;
    }
}