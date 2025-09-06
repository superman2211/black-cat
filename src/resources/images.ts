import { createCanvas } from "../utils/browser";
import { cloneCanvas, filterImage } from "../utils/image";

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

        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;

        const coloredImage = cloneCanvas(images[id]);

        filterImage(coloredImage, (color) => {
            color[0] = r;
            color[1] = g;
            color[2] = b;
        });

        coloredImages[key] = addImage(coloredImage);
    }

    return coloredImages[key];
}
