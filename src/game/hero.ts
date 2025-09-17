import { DEBUG } from "../debug";
import { game, GameState } from "../engine/game";
import { gamepadData } from "../engine/gamepad";
import { isKeyPressed, Key } from "../engine/input";
import { joystick } from "../engine/joystick";
import { addUnit, Unit, UnitConfig, units } from "../engine/unit";
import { lastLevel } from "../engine/waves";
import { kate0, kate1, kate10, kate11, kate12, kate13, kate14, kate15, kate16, kate17, kate18, kate19, kate2, kate3, kate4, kate5, kate6, kate7, kate8, kate9 } from "../resources/id";
import { playLoose } from "../resources/sound/audio";
import { Vector2 } from "../utils/geom";

export const enum HeroInputType {
    Keyboard,
    TouchJoystick,
    Gamepad,
}

export let heroInputType: HeroInputType = HeroInputType.Keyboard;

export const setHeroInputType = (value: HeroInputType) => heroInputType = value;

const config: UnitConfig = {
    mob: false,
    name: "kate",
    health: 1000,
    walkSpeed: 40,
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
            { image: kate14, time: 0.5 },
        ],
        damage2: [
            { image: kate15, time: 0.5 },
        ],
        knockdown: [
            { image: kate15, time: 0.3 },
            { image: kate16, time: 0.3 },
            { image: kate17, time: 1.0 },
            { image: kate18, time: 0.3 },
            { image: kate19, time: 0.3 },
            { image: kate0, time: 0.3 },
        ],
        dead1: [
            { image: kate0, time: 0.1 },
            { image: kate15, time: 0.3 },
            { image: kate16, time: 0.3 },
            { image: kate17, time: 1.0 },
            { image: -1, time: 0.2 },
            { image: kate17, time: 0.2 },
            { image: -1, time: 0.2 },
            { image: kate17, time: 0.2 },
            { image: -1, time: 0.2 },
            { image: kate17, time: 0.2 },
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

    if (!units.includes(hero)) {
        game.state = GameState.GameOver;
        playLoose();
    }

    if (hero.health <= 0) {
        return;
    }

    hero.controller.move.x = 0;
    hero.controller.move.y = 0;
    hero.controller.attack = false;

    if (isKeyPressed(Key.Left) || isKeyPressed(Key.A)) {
        hero.controller.move.x = -1;
        heroInputType = HeroInputType.Keyboard;
    }

    if (isKeyPressed(Key.Right) || isKeyPressed(Key.D)) {
        hero.controller.move.x = 1;
        heroInputType = HeroInputType.Keyboard;
    }

    if (isKeyPressed(Key.Up) || isKeyPressed(Key.W)) {
        hero.controller.move.y = -1;
        heroInputType = HeroInputType.Keyboard;
    }

    if (isKeyPressed(Key.Down) || isKeyPressed(Key.S)) {
        hero.controller.move.y = 1;
        heroInputType = HeroInputType.Keyboard;
    }

    if (isKeyPressed(Key.Space) || isKeyPressed(Key.X)) {
        hero.controller.attack = true;
        heroInputType = HeroInputType.Keyboard;
    }

    if (DEBUG) {
        if (isKeyPressed(Key.Z)) {
            lastLevel();
        }
    }

    if (joystick.moveId != -1) {
        const direction = Vector2.subtract(joystick.moveStick, joystick.move);
        hero.controller.move.x = direction.x;
        hero.controller.move.y = direction.y;

        heroInputType = HeroInputType.TouchJoystick;
    }

    if (joystick.attackId != -1) {
        hero.controller.attack = true;
        heroInputType = HeroInputType.TouchJoystick;
    }

    if (gamepadData.axe.x != 0 || gamepadData.axe.y != 0) {
        hero.controller.move.x = gamepadData.axe.x;
        hero.controller.move.y = gamepadData.axe.y;
        heroInputType = HeroInputType.Gamepad;
    }

    if (gamepadData.button) {
        hero.controller.attack = true;
        heroInputType = HeroInputType.Gamepad;
    }
}