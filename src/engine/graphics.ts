import { DEBUG } from "../debug";
import { units } from "./unit";
import { getIdByCharCode } from "../resources/font";
import { images } from "../resources/images";
import { drawImage, getContext, now } from "../utils/browser";
import { mathFloor, mathMax, mathMin, mathRound } from "../utils/math";
import { deltaS, nowMS } from "../utils/time";
import { getStage } from "./stage";
import { Sprite } from "./sprite";

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

    context.fillStyle = "gray";
    context.fillRect(0, 0, gameWidth, gameHeight);

    const stage = getStage();

    context.save();
    context.translate(mathRound(-stage.cameraPosition.x), mathRound(-stage.cameraPosition.y));

    drawSprite(stage.wall);
    drawSprite(stage.floor);

    for (const unit of units.values()) {
        drawSprite(unit.sprite);
    }

    context.restore();
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

    const tx = mathRound(sprite.x || 0);
    const ty = mathRound(sprite.y || 0);

    const image = images[sprite.image];

    if (sprite.flipX) {
        context.transform(-1, 0, 0, 1, tx + image.width, ty);
    } else {
        context.transform(1, 0, 0, 1, tx, ty);
    }

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
            0xffffff
        );
    }
}

const drawText = (x: number, y: number, text: string, color: number) => {
    for (let i = 0; i < text.length; i++) {
        const code = text[i].toUpperCase().charCodeAt(0);
        const id = getIdByCharCode(code);
        if (id !== undefined) {
            // const char = getColoredImage(id, color);
            let image = images[id];
            if (image !== undefined) {
                drawImage(context, image, x + i * 8, y);
            }
        }
    }
}