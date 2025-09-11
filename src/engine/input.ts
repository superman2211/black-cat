import { canvas } from "./graphics";
import { unlockAudio } from "../resources/sound/audio";
import { domDocument } from "../utils/browser";

const keys: { [key: string]: boolean } = {};
export let anyKey = false;

export const initInput = () => {
    domDocument.onkeydown = (e) => {
        // console.log(e.keyCode);
        unlockAudio();
        anyKey = true;
        keys[e.keyCode] = true;
        e.preventDefault();
    }

    domDocument.onkeyup = (e) => {
        anyKey = false;
        unpressKey(e.keyCode);
        e.preventDefault();
    }

    canvas.onmousedown = () => {
        unlockAudio();
    }

    canvas.ontouchstart = () => {
        unlockAudio();
    }
}

export const enum Key {
    Up = 38,
    Down = 40,
    Left = 37,
    Right = 39,
    A = 65,
    D = 68,
    W = 87,
    S = 83,
    Z = 90,
    X = 88,
    U = 85,
    I = 73,
    J = 74,
    K = 75,
    Enter = 13,
    Space = 32,
}

export const isKeyPressed = (code: Key): boolean | undefined => keys[code];
export const unpressKey = (code: Key) => delete keys[code];