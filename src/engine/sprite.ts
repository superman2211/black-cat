import { images } from "../resources/images";
import { drawImage } from "../utils/browser";
import { mathRound } from "../utils/math";

export interface Sprite {
    image: number,
    x?: number,
    y?: number,
    flipX?: boolean,
    flipY?: boolean,
    scaleY?: number,
}

export const drawSprite = (context: CanvasRenderingContext2D, sprite: Sprite) => {
    context.save();

    const image = images[sprite.image];

    let a = 1;
    let b = 0;
    let c = 0;
    let d = sprite.scaleY || 1;

    let tx = mathRound(sprite.x || 0);
    let ty = mathRound(sprite.y || 0);

    if (sprite.flipX) {
        a = -1;
        tx += image.width;
    }

    if (sprite.flipY) {
        d = -1;
        ty += image.height;
    }

    context.transform(a, b, c, d, tx, ty);

    drawImage(context, image, 0, 0);

    context.restore();
}

export const drawSprites = (context: CanvasRenderingContext2D, sprites: Array<Sprite>) => {
    for (const sprite of sprites) {
        drawSprite(context, sprite);
    }
}