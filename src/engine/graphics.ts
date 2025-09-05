import { DEBUG } from "../debug";
import { units } from "./unit";
import { getIdByCharCode } from "../resources/font";
import { images } from "../resources/images";
import { drawImage, getContext, now } from "../utils/browser";
import { mathFloor, mathMax, mathMin, mathRound } from "../utils/math";
import { deltaS, nowMS } from "../utils/time";

export const canvas = document.getElementById('c') as HTMLCanvasElement;
canvas.style.imageRendering = 'pixelated';

const context = getContext(canvas);

export const width = 200;
export const height = 200;

const offset = { x: 0, y: 0 };

export const updateSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const scale = mathMin(screenWidth / width, screenHeight / height);

    canvas.width = mathMax(width, screenWidth / scale);
    canvas.height = mathMax(height, screenHeight / scale);

    canvas.style.width = `${screenWidth}px`;
    canvas.style.height = `${screenHeight}px`;

    offset.x = mathFloor((canvas.width - width) / 2);
    offset.y = mathFloor((canvas.height - height) / 2);
}

export const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, offset.x, offset.y);

    context.fillStyle = "gray";
    context.fillRect(0, 0, width, height);

    for (const unit of units.values()) {
        let image = images[unit.image];
        if (unit.direction > 0) {
            drawImage(context, image, unit.position.x, unit.position.y);
        } else {
            drawTransformedImage(image, unit.position.x, unit.position.y, -1, 0, 0, 1, image.width, 0);
        }
    }

    drawFPS();

    // drawText(
    //     65, 0,
    //     'BLACK KATE',
    //     0xffffff
    // );
}

const drawTransformedImage = (
    image: HTMLCanvasElement,
    x: number, y: number,
    a: number, b: number, c: number, d: number, tx: number, ty: number
) => {
    context.save();
    context.transform(a, b, c, d, tx + mathRound(x), ty + mathRound(y));

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