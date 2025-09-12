import { DEBUG } from "../debug";
import { units } from "./unit";
import { getIdByCharCode } from "../resources/font";
import { getColoredImage, images } from "../resources/images";
import { drawImage, getContext, hasTouch, now } from "../utils/browser";
import { mathFloor, mathMax, mathMin, mathPI2, mathRound } from "../utils/math";
import { deltaS, nowMS } from "../utils/time";
import { getStage } from "./stage";
import { drawSprite, Sprite } from "./sprite";
import { drawGradientH, drawGradientV } from "../utils/image";
import { effects } from "./effect";
import { entities, Entity } from "./entity";
import { formatColor } from "../utils/pattern";
import { effectGainNode, musicGainNode } from "../resources/sound/audio";
import { touches } from "./input";
import { joystick } from "./joystick";
import { HeroInputType, heroInputType } from "../game/hero";

export const screenCanvas = document.getElementById('c') as HTMLCanvasElement;
screenCanvas.style.imageRendering = 'pixelated';

const context = getContext(screenCanvas);

export const gameWidth = 200;
export const gameHeight = 200;

export const screenOffset = { x: 0, y: 0 };
export let screenScale = 1;

export const updateSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    screenScale = mathMin(screenWidth / gameWidth, screenHeight / gameHeight);

    screenCanvas.width = mathMax(gameWidth, screenWidth / screenScale);
    screenCanvas.height = mathMax(gameHeight, screenHeight / screenScale);

    screenCanvas.style.width = `${screenWidth}px`;
    screenCanvas.style.height = `${screenHeight}px`;

    screenOffset.x = mathFloor((screenCanvas.width - gameWidth) / 2);
    screenOffset.y = mathFloor((screenCanvas.height - gameHeight) / 2);
}

export const draw = () => {
    context.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
    const stage = getStage();

    context.save();
    context.setTransform(1, 0, 0, 1, screenOffset.x, screenOffset.y);

    context.save();
    context.translate(mathRound(-stage.camera_.x), mathRound(-stage.camera_.y));

    drawSprite(context, stage.back_);

    context.shadowBlur = 2;
    context.shadowColor = "black";
    for (const unit of units) {
        drawSprite(context, unit.shadow_);
    }
    for (const item of stage.items_) {
        if (item.shadow_) {
            drawSprite(context, item.shadow_);
        }
    }
    context.shadowBlur = 0;

    entities.sort((a, b) => a.position_.y == b.position_.y ? b.position_.x - a.position_.x : a.position_.y - b.position_.y);

    for (const entity of entities) {
        drawSprite(context, entity.sprite_);
    }

    // for (const item of stage.items) {
    //     context.fillStyle = formatColor(0x55ff0000);
    //     context.fillRect(
    //         item.position.x + item.bounds.x,
    //         item.position.y + item.bounds.y,
    //         item.bounds.w,
    //         item.bounds.h,
    //     );
    // }

    for (const effect of effects) {
        drawSprite(context, effect.sprite_);
    }

    context.restore();

    context.fillStyle = "black";
    if (screenCanvas.width < screenCanvas.height) {
        context.fillRect(0, - screenOffset.y, gameWidth, screenOffset.y);
        context.fillRect(0, gameHeight, gameWidth, gameHeight);
    } else {
        context.fillRect(- screenOffset.x, 0, screenOffset.x, gameWidth);
        context.fillRect(gameWidth, 0, gameWidth, gameHeight);
    }

    context.restore();

    drawDebug();

    // drawText(
    //     65, 0,
    //     'BLACK KATE',
    //     0xffffff
    // );

    for (const touchId in touches) {
        const touch = touches[touchId];
        context.fillStyle = "red";
        context.fillRect(touch.x, touch.y, 10, 10);
    }

    if (heroInputType == HeroInputType.TouchJoystick) {
        context.strokeStyle = formatColor(0x99ffffff);
        context.lineWidth = 2;

        context.beginPath();
        context.arc(mathRound(joystick.move_.x), mathRound(joystick.move_.y), joystick.moveRadius_, 0, mathPI2);
        context.closePath();
        context.stroke();

        if (joystick.moveId_ != -1) {
            context.beginPath();
            context.arc(mathRound(joystick.moveStick_.x), mathRound(joystick.moveStick_.y), joystick.moveStickRadius_, 0, mathPI2);
            context.closePath();
            context.stroke();
        }

        context.strokeStyle = formatColor(0x99ff0000);
        context.lineWidth = 2;

        context.beginPath();
        context.arc(mathRound(joystick.attack_.x), mathRound(joystick.attack_.y), joystick.attackRadius_, 0, mathPI2);
        context.closePath();
        context.stroke();
        if (joystick.attackId_ != -1) {
            context.fillStyle = formatColor(0x33ff0000);
            context.fill();
        }
    }
}

const drawDebug = () => {
    if (DEBUG) {
        context.shadowBlur = 3;
        context.shadowColor = "black";

        const frameTime = (now() - nowMS).toFixed();
        const fps = (1 / deltaS).toFixed();

        drawText(
            3, 3,
            `FPS ${fps} TIME ${frameTime}`,
            0xffffffff
        );

        const musicVolume = mathRound(musicGainNode.gain.value * 100);
        const effectVolume = mathRound(effectGainNode.gain.value * 100);

        drawText(
            3, 3 + 16,
            `MUSIC ${musicVolume}`,
            0xff00ffff
        );

        drawText(
            3, 3 + 32,
            `EFFECT ${effectVolume}`,
            0xffff00ff
        );

        context.shadowBlur = 0;
    }
}

const drawText = (x: number, y: number, text: string, color: number) => {
    for (let i = 0; i < text.length; i++) {
        const code = text[i].toUpperCase().charCodeAt(0);
        const id = getIdByCharCode(code);
        if (id !== undefined) {
            const char = getColoredImage(id, color);
            let image = images[char];
            if (image !== undefined) {
                drawImage(context, image, x + i * 8, y);
            }
        }
    }
}