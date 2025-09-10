import { DEBUG } from "../debug";
import { units } from "./unit";
import { getIdByCharCode } from "../resources/font";
import { getColoredImage, images } from "../resources/images";
import { drawImage, getContext, now } from "../utils/browser";
import { mathFloor, mathMax, mathMin, mathRound } from "../utils/math";
import { deltaS, nowMS } from "../utils/time";
import { getStage } from "./stage";
import { drawSprite, Sprite } from "./sprite";
import { drawGradientH, drawGradientV } from "../utils/image";
import { effects } from "./effect";
import { entities, Entity } from "./entity";
import { formatColor } from "../utils/pattern";

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

    drawSprite(context, stage.back);

    context.shadowBlur = 2;
    context.shadowColor = "black";
    for (const unit of units) {
        drawSprite(context, unit.shadow);
    }
    context.shadowBlur = 0;

    entities.sort((a, b) => a.position.y == b.position.y ? b.position.x - a.position.x : a.position.y - b.position.y);

    for (const entity of entities) {
        drawSprite(context, entity.sprite);
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
        drawSprite(context, effect.sprite);
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