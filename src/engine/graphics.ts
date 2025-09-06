import { DEBUG } from "../debug";
import { units } from "./unit";
import { getIdByCharCode } from "../resources/font";
import { getColoredImage, images } from "../resources/images";
import { drawImage, getContext, now } from "../utils/browser";
import { mathFloor, mathMax, mathMin, mathRound } from "../utils/math";
import { deltaS, nowMS } from "../utils/time";
import { getStage } from "./stage";
import { Sprite } from "./sprite";
import { drawGradientH, drawGradientV } from "../utils/image";

export const canvas = document.getElementById('c') as HTMLCanvasElement;
canvas.style.imageRendering = 'pixelated';

const context = getContext(canvas);

export const gameWidth = 200;
export const gameHeight = 200;

const offset = { x: 0, y: 0 };

export const updateSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const scale = mathMin(screenWidth / gameWidth, screenHeight / gameHeight);

    canvas.width = mathMax(gameWidth, screenWidth / scale);
    canvas.height = mathMax(gameHeight, screenHeight / scale);

    canvas.style.width = `${screenWidth}px`;
    canvas.style.height = `${screenHeight}px`;

    offset.x = mathFloor((canvas.width - gameWidth) / 2);
    offset.y = mathFloor((canvas.height - gameHeight) / 2);
}

export const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, offset.x, offset.y);

    const stage = getStage();

    context.save();
    context.translate(mathRound(-stage.camera.x), mathRound(-stage.camera.y));

    drawSprite(stage.back);

    for (const unit of units.values()) {
        drawSprite(unit.shadow);
    }

    for (const unit of units.values()) {
        drawSprite(unit.sprite);
    }

    context.restore();

    context.fillStyle = "black";
    if (canvas.width < canvas.height) {
        context.fillRect(0, - offset.y, gameWidth, offset.y);
        context.fillRect(0, gameHeight, gameWidth, gameHeight);
    } else {
        context.fillRect(- offset.x, 0, offset.x, gameWidth);
        context.fillRect(gameWidth, 0, gameWidth, gameHeight);
    }

    drawFPS();

    // drawText(
    //     65, 0,
    //     'BLACK KATE',
    //     0xffffff
    // );
}

const drawSprite = (
    sprite: Sprite
) => {
    context.save();

    const image = images[sprite.image];

    let a = 1;
    let b = 0;
    let c = 0;
    let d = sprite.scaleY || 1;

    let tx = mathRound(sprite.x || 0);
    let ty = mathRound(sprite.y || 0);

    if (sprite.flipX) {
        a = -1;
        tx += image.width;
    }

    context.transform(a, b, c, d, tx, ty);

    drawImage(context, image, 0, 0);

    context.restore();
}

const drawFPS = () => {
    if (DEBUG) {
        const frameTime = (now() - nowMS).toFixed();
        const fps = (1 / deltaS).toFixed();

        drawText(
            3, 3,
            `FPS ${fps} TIME ${frameTime}`,
            0x99ffffff
        );
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