import { Stage } from "../../engine/stage";
import { barFloor0, barFloor1, barFloor2, barFloor3, barWall0, barWall1, barWall2, barWall3, barWall4, barWall5 } from "../../resources/id";
import { images } from "../../resources/images";
import { createCanvas, drawImage, getContext } from "../../utils/browser"
import { generateRandomTileImage, generateTileImage } from "../../utils/image-generator";
import { mathCeil, randomSelect } from "../../utils/math";

export const getBarStage = (): Stage => {
    const width = 400;
    const height = 150;
    const wallHeight = 100;

    const floor = { image: generateRandomTileImage(width, height, [barFloor0, barFloor1, barFloor2, barFloor3]) }
    const wall = { image: generateWallImage(width, wallHeight), x: 0, y: -wallHeight };

    return {
        width,
        height,
        floor,
        wall,
        cameraPosition: { x: 0, y: 0 },
    }
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

    return id;
}