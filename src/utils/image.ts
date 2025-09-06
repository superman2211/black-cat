import { images } from "../resources/images";
import { createCanvas, drawImage, getContext } from "./browser";
import { mathCeil, randomChancesSelect, randomSelect } from "./math";
import { createGradient } from "./pattern";

export const generateRandomTileImage = (width: number, height: number, ids: Array<number>, chances: Array<number>): HTMLCanvasElement => {
    const canvas = createCanvas();
    const context = getContext(canvas);

    let image = images[ids[0]];

    canvas.width = width;
    canvas.height = height;

    const sx = mathCeil(width / image.width);
    const sy = mathCeil(height / image.height);

    for (let x = 0; x < sx; x++) {
        for (let y = 0; y < sy; y++) {
            image = images[randomChancesSelect(ids, chances)];
            context.drawImage(image, x * image.width, y * image.height);
        }
    }

    return canvas;
}

export const generateTileImage = (width: number, height: number, imageId: number): HTMLCanvasElement => {
    const canvas = createCanvas();
    const context = getContext(canvas);

    canvas.width = width;
    canvas.height = height;

    const image = images[imageId];

    const sx = mathCeil(width / image.width);
    const sy = mathCeil(height / image.height);

    for (let x = 0; x < sx; x++) {
        for (let y = 0; y < sy; y++) {
            context.drawImage(image, x * image.width, y * image.height);
        }
    }

    return canvas;
}

export const drawCommands = (commands: Array<number>, context: CanvasRenderingContext2D) => {
    for (let i = 0; i < commands.length; i += 3) {
        const id = commands[i];
        const x = commands[i + 1];
        const y = commands[i + 2];
        const image = images[id];
        drawImage(context, image, x, y);
    }
}

export const drawGradientV = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, startColor: number, endColor: number) => {
    context.fillStyle = createGradient(context, x, y, x, y + height, startColor, endColor);
    context.fillRect(x, y, width, height);
}

export const drawGradientH = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, startColor: number, endColor: number) => {
    context.fillStyle = createGradient(context, x, y, x + width, y, startColor, endColor);
    context.fillRect(x, y, width, height);
}

export const filterImage = (canvas: HTMLCanvasElement, filter: (color: Uint8ClampedArray) => void) => {
    const context = getContext(canvas);
    const width = canvas.width;
    const height = canvas.height;

    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    let i = 0;

    while (i < pixels.length) {
        const color = pixels.slice(i, i + 4);

        filter(color);

        pixels.set(color, i);

        i += 4;
    }

    context.putImageData(imageData, 0, 0);
}

export const cloneCanvas = (source: HTMLCanvasElement): HTMLCanvasElement => {
    var target = createCanvas();
    var context = getContext(target);
    target.width = source.width;
    target.height = source.height;
    context.drawImage(source, 0, 0);
    return target;
}