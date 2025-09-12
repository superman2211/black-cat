import { Vector2 } from "../utils/geom";
import { mathAbs } from "../utils/math";

export const gamepadData = {
    axe_: { x: 0, y: 0 },
    button_: false,
}

const XBoxUp = 12;
const XBoxDown = 13;
const XBoxLeft = 14;
const XBoxRight = 15;
const XBoxAction0 = 0;
const XBoxAction1 = 1;
const XBoxAction2 = 2;
const XBoxAction3 = 3;

export const updateGamepad = () => {
    if ('getGamepads' in navigator) {
        gamepadData.axe_.x = 0;
        gamepadData.axe_.y = 0;
        gamepadData.button_ = false;

        const gamepads = navigator.getGamepads();

        for (const gamepad of gamepads) {
            if (gamepad && gamepad.connected) {
                if (gamepad.axes.length >= 2) {
                    gamepadData.axe_.x += gamepad.axes[0];
                    gamepadData.axe_.y += gamepad.axes[1];
                }

                if (gamepad.axes.length >= 4) {
                    gamepadData.axe_.x += gamepad.axes[2];
                    gamepadData.axe_.y += gamepad.axes[3];
                }

                for (let i = 0; i < gamepad.buttons.length; i++) {
                    const button = gamepad.buttons[i];

                    if (button.pressed) {
                        switch (i) {
                            case XBoxUp:
                                gamepadData.axe_.y -= 1;
                                break;

                            case XBoxDown:
                                gamepadData.axe_.y += 1;
                                break;

                            case XBoxLeft:
                                gamepadData.axe_.x -= 1;
                                break;

                            case XBoxRight:
                                gamepadData.axe_.x += 1;
                                break;

                            case XBoxAction0:
                            case XBoxAction1:
                            case XBoxAction2:
                            case XBoxAction3:
                                gamepadData.button_ = true;
                                break;
                        }
                    }
                }
            }
        }

        if (mathAbs(gamepadData.axe_.x) < 0.2) {
            gamepadData.axe_.x = 0;
        }

        if (mathAbs(gamepadData.axe_.y) < 0.2) {
            gamepadData.axe_.y = 0;
        }

        Vector2.normalize_(gamepadData.axe_);
    }
}