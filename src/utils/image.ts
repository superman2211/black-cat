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
        const pixel = pixels.slice(i, i + 4);

        filter(pixel);

        pixels.set(pixel, i);

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

export const getPallette = (canvas: HTMLCanvasElement): Array<number> => {
    const pallette: Array<number> = [];

    filterImage(canvas, (pixel) => {
        const color = pixelToColor(pixel);
        if (pallette.indexOf(color) == -1) {
            pallette.push(color);
        }
    });

    return pallette;
}

export const applyPallette = (canvas: HTMLCanvasElement, sourcePallette: Array<number>, targetPallette: Array<number>) => {
    filterImage(canvas, (pixel) => {
        const sourceColor = pixelToColor(pixel);

        const index = sourcePallette.indexOf(sourceColor);

        if (index != -1) {
            const targetColor = targetPallette[index];

            colorToPixel(targetColor, pixel);
        }
    });
}

const u32 = new Uint32Array(1);

export const pixelToColor = (pixel: Uint8ClampedArray): number => {
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const a = pixel[3];

    u32[0] = (a << 24) | (r << 16) | (g << 8) | b;

    return u32[0];
}

export const colorToPixel = (color: number, pixel: Uint8ClampedArray) => {
    const a = (color >> 24) & 0xff;
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;

    pixel[0] = r;
    pixel[1] = g;
    pixel[2] = b;
    pixel[3] = a;
}