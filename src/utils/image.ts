import { images } from "../resources/images";
import { createCanvas, drawImage, getContext } from "./browser";
import { mathCeil, randomChancesSelect, randomSelect } from "./math";

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
