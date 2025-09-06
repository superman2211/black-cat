import { images } from "../resources/images";
import { createCanvas, getContext } from "./browser";
import { mathCeil, randomSelect } from "./math";

export const generateRandomTileImage = (width: number, height: number, ids: Array<number>): number => {
    const canvas = createCanvas();
    const context = getContext(canvas);

    let image = images[ids[0]];

    canvas.width = width;
    canvas.height = height;

    const sx = mathCeil(width / image.width);
    const sy = mathCeil(height / image.height);

    for (let x = 0; x < sx; x++) {
        for (let y = 0; y < sy; y++) {
            image = images[randomSelect(ids)];
            context.drawImage(image, x * image.width, y * image.height);
        }
    }

    let id = images.length;
    images.push(canvas);

    return id;
}

export const generateTileImage = (width: number, height: number, imageId: number): number => {
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

    let id = images.length;
    images.push(canvas);

    return id;
}
