import { gamepadVibration } from "../engine/gamepad";

export const vibrate = (values: Array<number>) => {
    if ("vibrate" in navigator) {
        navigator.vibrate(values);
    }

    gamepadVibration();
}