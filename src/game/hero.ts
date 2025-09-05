import { isKeyPressed, Key } from "../engine/input";
import { addUnit, UnitConfig, units, UnitState } from "../engine/unit";
import { kate0, kate1, kate10, kate2, kate3, kate4, kate5, kate6, kate7, kate8, kate9 } from "../resources/id";
import { mathFloor } from "../utils/math";
import { deltaS } from "../utils/time";

const config: UnitConfig = {
    walkSpeed: 30,
    animations: {
        stand: [
            { image: kate0, time: 0.2 },
            { image: kate1, time: 0.2 },
            { image: kate2, time: 0.2 },
            { image: kate1, time: 0.2 },
            { image: kate0, time: 0.2 },
            { image: kate3, time: 0.2 },
        ],
        walk: [
            { image: kate0, time: 0.1 },
            { image: kate4, time: 0.1 },
            { image: kate5, time: 0.1 },
            { image: kate4, time: 0.1 },
        ],
        jab: [
            { image: kate0, time: 0.05 },
            { image: kate8, time: 0.1 },
            { image: kate0, time: 0.05 },
        ],
        cross: [
            { image: kate0, time: 0.1 },
            { image: kate8, time: 0.1 },
            { image: kate9, time: 0.1 },
            { image: kate10, time: 0.1 },
        ],
        kick: [
            { image: kate0, time: 0.05 },
            { image: kate6, time: 0.05 },
            { image: kate7, time: 0.1 },
            { image: kate6, time: 0.1 },
        ]
    }
};

export const hero = addUnit(config);
hero.position.y = 100;
hero.position.x = 100;

export const updateHero = () => {
    hero.controller.move.x = 0;
    hero.controller.leg = false;
    hero.controller.hand = false;

    if (isKeyPressed(Key.Left) || isKeyPressed(Key.A)) {
        hero.controller.move.x = -1;
    }

    if (isKeyPressed(Key.Right) || isKeyPressed(Key.D)) {
        hero.controller.move.x = 1;
    }

    if (isKeyPressed(Key.Up)) {
        hero.controller.leg = true;
    }

    if (isKeyPressed(Key.Down)) {
        hero.controller.hand = true;
    }
}