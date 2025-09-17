import { hasTouch } from "../utils/browser"
import { Vector2 } from "../utils/geom";
import { screenCanvas } from "./graphics";
import { touches } from "./input"

export const joystick = {
    moveId: -1,

    move: { x: 0, y: 0 },
    moveRadius: 30,

    moveStickRadius: 10,
    moveStick: { x: 0, y: 0 },

    attackId: -1,
    attack: { x: 0, y: 0 },
    attackRadius: 30,
}

const border = 20;
const delta = { x: 60, y: 60 };

export const updateJoystick = () => {
    if (!hasTouch) {
        return;
    }

    joystick.move.x = delta.x;
    joystick.move.y = screenCanvas.height - delta.y;

    joystick.attack.x = screenCanvas.width - delta.x;
    joystick.attack.y = screenCanvas.height - delta.y;

    if (joystick.moveId == -1) {
        joystick.moveStick.x = joystick.move.x;
        joystick.moveStick.y = joystick.move.y;

        for (const touchId in touches) {
            const touch = touches[touchId];
            if (touch.started) {
                const distance = Vector2.distance(joystick.move, touch);
                if (distance < joystick.moveRadius + border) {
                    joystick.moveId = Number(touchId);

                    joystick.moveStick.x = touch.x;
                    joystick.moveStick.y = touch.y;
                    break;
                }
            }
            // console.log("touch", touchId, touches[touchId]);
        }
    } else {
        const touch = touches[joystick.moveId];
        if (touch) {
            joystick.moveStick.x = touch.x;
            joystick.moveStick.y = touch.y;
        } else {
            joystick.moveId = -1;
        }
    }

    const direction = Vector2.subtract(joystick.moveStick, joystick.move);
    const distance = Vector2.length(direction);
    if (distance > joystick.moveRadius) {
        Vector2.normalize(direction);
        joystick.moveStick.x = joystick.move.x + direction.x * joystick.moveRadius;
        joystick.moveStick.y = joystick.move.y + direction.y * joystick.moveRadius;
    }

    if (joystick.attackId == -1) {
        for (const touchId in touches) {
            const touch = touches[touchId];
            if (touch.started) {
                const distance = Vector2.distance(joystick.attack, touch);
                if (distance < joystick.attackRadius + border) {
                    joystick.attackId = Number(touchId);
                }
            }
        }
    } else {
        const touch = touches[joystick.attackId];
        if (!touch) {
            joystick.attackId = -1;
        }
    }
}