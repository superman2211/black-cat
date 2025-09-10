import { createCanvas, getContext } from "../utils/browser";
import { cloneCanvas, filterImage } from "../utils/image";
import { mathRandom, mathRound } from "../utils/math";

export const images: HTMLCanvasElement[] = [];

const coloredImages: { [key: string]: number } = {};

export const addImage = (image: HTMLCanvasElement): number => {
    const id = images.length;
    images.push(image);
    return id;
}

export const getColoredImage = (id: number, color: number): number => {
    const key = `${id}_${color}`;
    if (!coloredImages[key]) {
        const a = (color >> 24) & 0xff;
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;

        const coloredImage = cloneCanvas(images[id]);

        filterImage(coloredImage, (color) => {
            color[0] = r;
            color[1] = g;
            color[2] = b;
            if (color[3]) {
                color[3] = a;
            }
        });

        coloredImages[key] = addImage(coloredImage);
    }

    return coloredImages[key];
}

export const noise = (offset: number, canvas: HTMLCanvasElement) => {
    const context = getContext(canvas);
    const offset2 = offset / 2;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let i = 0;
    while (i < data.length) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = r - offset2 + offset * mathRandom();
        data[i + 1] = g - offset2 + offset * mathRandom();
        data[i + 2] = b - offset2 + offset * mathRandom();
        i += 4;
    }
    context.putImageData(imageData, 0, 0);
}