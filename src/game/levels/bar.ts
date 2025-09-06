import { Stage } from "../../engine/stage";
import { floor0, floor1, floor2, floor3 } from "../../resources/id";
import { images } from "../../resources/images";
import { createCanvas, getContext } from "../../utils/browser"
import { chance, mathCeil, mathRandom, randomSelect } from "../../utils/math";

export const generateFloor = (width: number, height: number, ids: Array<number>): number => {
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

export const getBarStage = (): Stage => {
    const width = 400;
    const height = 150;

    return {
        width,
        height,
        floor: { image: generateFloor(width, height, [floor0, floor1, floor2, floor3]) },
        cameraPosition: { x: 0, y: 0 },
    }
}