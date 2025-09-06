import { Stage } from "../../engine/stage";
import { barFloor0, barFloor1, barFloor2, barFloor3, barWall0, barWall1, barWall2, barWall3, barWall4, barWall5 } from "../../resources/id";
import { images } from "../../resources/images";
import { createCanvas, drawImage, getContext } from "../../utils/browser"
import { generateRandomTileImage, generateTileImage } from "../../utils/image-generator";
import { mathCeil, mathRandom, randomSelect } from "../../utils/math";

export const getBarStage = (): Stage => {
    const width = 400;
    const height = 150;
    const wallHeight = 100;

    const floor = { image: generateFloorImage(width, height) }
    const wall = { image: generateWallImage(width, wallHeight), x: 0, y: -wallHeight };

    return {
        width,
        height,
        floor,
        wall,
        cameraPosition: { x: 0, y: 0 },
    }
}

const generateFloorImage = (width: number, height: number): number => {
    let id = generateRandomTileImage(width, height, [barFloor0, barFloor1, barFloor2, barFloor3])

    const image = images[id];

    noise(10, image);

    return id;
}

const generateWallImage = (width: number, height: number): number => {
    const id = generateTileImage(width, height, barWall0);

    const image = images[id];
    const context = getContext(image);

    const columns = [barWall1, barWall2, barWall3];

    const columnStep = 50;

    for (let x = 0; x < width; x += columnStep) {
        for (let y = 0; y < width; y += 16) {
            const columnImage = images[randomSelect(columns)];
            drawImage(context, columnImage, x, y);
        }
    }


    const wallpaper0 = images[barWall4];
    drawImage(context, wallpaper0, columnStep - 13, 0);
    drawImage(context, wallpaper0, columnStep * 3 - 13, 0);
    drawImage(context, wallpaper0, columnStep * 6 - 13, 0);

    const wallpaper1 = images[barWall5];
    drawImage(context, wallpaper1, columnStep * 2 - 17, 0);
    drawImage(context, wallpaper1, columnStep * 5 - 30, 0);

    noise(10, image);

    return id;
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
