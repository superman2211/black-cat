import { isKeyPressed, Key } from "../../engine/input"
import { limit } from "../../utils/math";
import { effectGainNode, musicGainNode } from "./audio"

export const controlAudio = () => {
    const step = 0.01;

    if (isKeyPressed(Key.U)) {
        musicGainNode.gain.value -= step;
    }

    if (isKeyPressed(Key.I)) {
        musicGainNode.gain.value += step;
    }

    musicGainNode.gain.value = limit(0, 1, musicGainNode.gain.value);

    if (isKeyPressed(Key.J)) {
        effectGainNode.gain.value -= step;
    }

    if (isKeyPressed(Key.K)) {
        effectGainNode.gain.value += step;
    }

    effectGainNode.gain.value = limit(0, 1, effectGainNode.gain.value);
}
