import { Stage } from "../../engine/stage";
import { barFloor0, barFloor1, barFloor2, barFloor3, barWall0, barWall1, barWall2, barWall3, barWall4, barWall5 } from "../../resources/id";
import { addImage, images } from "../../resources/images";
import { createCanvas, drawImage, getContext } from "../../utils/browser"
import { drawCommands, drawGradientV, generateRandomTileImage, generateTileImage } from "../../utils/image";
import { mathRandom, randomChancesSelect, randomSelect } from "../../utils/math";

export const getBarStage = (): Stage => {
    const floorWidth = 400;
    const floorHeight = 150;
    const wallHeight = 95;

    const floorCanvas = generateFloorImage(floorWidth, floorHeight);
    const wallCanvas = generateWallImage(floorWidth, wallHeight);

    const backCanvas = createCanvas();
    const backContext = getContext(backCanvas);
    backCanvas.width = floorWidth;
    backCanvas.height = floorHeight + wallHeight;
    drawImage(backContext, wallCanvas, 0, 0);
    drawImage(backContext, floorCanvas, 0, wallHeight);

    const back = addImage(backCanvas);

    const borderX = 10;
    const borderY = 5;

    return {
        bounds: {
            x: borderX,
            y: wallHeight + borderY,
            w: floorWidth - borderX * 2,
            h: floorHeight - borderY * 2,
        },
        back: { image: back },
        camera: { x: 0, y: 0 },
    }
}

const generateFloorImage = (width: number, height: number): HTMLCanvasElement => {
    const image = generateRandomTileImage(width, height, [barFloor0, barFloor1, barFloor2, barFloor3], [3, 2, 1, 1]);
    const context = getContext(image);

    const border = 30;

    context.fillStyle = "black";
    context.fillRect(0, 0, image.width, 1);

    drawGradientV(context, 0, 0, image.width, border, 0x77000000, 0);
    drawGradientV(context, 0, image.height - border, image.width, border, 0, 0x77000000);

    noise(10, image);

    return image;
}

const generateWallImage = (width: number, height: number): HTMLCanvasElement => {
    const image = generateTileImage(width, height, barWall0);
    const context = getContext(image);

    const columns = [barWall1, barWall2, barWall3];
    const columnsChances = [2, 1, 1];

    const columnStep = 50;

    for (let x = 0; x < width; x += columnStep) {
        for (let y = 0; y < width; y += 16) {
            const columnImage = images[randomChancesSelect(columns, columnsChances)];
            drawImage(context, columnImage, x, y);
        }
    }

    drawCommands(
        [
            barWall4, columnStep - 13, 0,
            barWall4, columnStep * 3 - 13, 0,
            barWall4, columnStep * 6 - 13, 0,

            barWall5, columnStep * 2 - 17, 0,
            barWall5, columnStep * 5 - 30, 0
        ],
        context,
    )

    const border = 40;
    drawGradientV(context, 0, image.height - border, image.width, border, 0, 0x77000000);

    noise(10, image);

    return image;
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
