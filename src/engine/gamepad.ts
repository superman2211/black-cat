import { Vector2 } from "../utils/geom";
import { mathAbs } from "../utils/math";
import { setAnyKey } from "./input";

export const gamepadData = {
    axe: { x: 0, y: 0 },
    button: false,
}

const enum GamepadKey {
    Up = 12,
    Down = 13,
    Left = 14,
    Right = 15,
    Action0 = 0,
    Action1 = 1,
    Action2 = 2,
    Action3 = 3,
}

let pressed = false;

export const updateGamepad = () => {
    if ('getGamepads' in navigator) {
        gamepadData.axe.x = 0;
        gamepadData.axe.y = 0;
        gamepadData.button = false;

        const gamepads = navigator.getGamepads();

        let pressedNow = false;

        for (const gamepad of gamepads) {
            if (gamepad && gamepad.connected) {
                if (gamepad.axes.length >= 2) {
                    gamepadData.axe.x += gamepad.axes[0];
                    gamepadData.axe.y += gamepad.axes[1];
                }

                if (gamepad.axes.length >= 4) {
                    gamepadData.axe.x += gamepad.axes[2];
                    gamepadData.axe.y += gamepad.axes[3];
                }

                for (let i = 0; i < gamepad.buttons.length; i++) {
                    const button = gamepad.buttons[i];

                    if (button.pressed) {
                        pressedNow = true;
                        switch (i) {
                            case GamepadKey.Up:
                                gamepadData.axe.y -= 1;
                                break;

                            case GamepadKey.Down:
                                gamepadData.axe.y += 1;
                                break;

                            case GamepadKey.Left:
                                gamepadData.axe.x -= 1;
                                break;

                            case GamepadKey.Right:
                                gamepadData.axe.x += 1;
                                break;

                            case GamepadKey.Action0:
                            case GamepadKey.Action1:
                            case GamepadKey.Action2:
                            case GamepadKey.Action3:
                                gamepadData.button = true;
                                break;
                        }
                    }
                }
            }
        }

        if (mathAbs(gamepadData.axe.x) < 0.2) {
            gamepadData.axe.x = 0;
        }

        if (mathAbs(gamepadData.axe.y) < 0.2) {
            gamepadData.axe.y = 0;
        }

        Vector2.normalize(gamepadData.axe);

        if (pressed != pressedNow) {
            pressed = pressedNow;
            setAnyKey(pressed);
        }
    }
}

export const gamepadVibration = () => {
    if ('getGamepads' in navigator) {
        const gamepads = navigator.getGamepads();
        for (const gamepad of gamepads) {
            if (gamepad && gamepad.connected) {
                gamepad.vibrationActuator.playEffect("dual-rumble", {
                    startDelay: 0,
                    duration: 100,
                    weakMagnitude: 1.0,
                    strongMagnitude: 1.0,
                });
            }
        }
    }
}