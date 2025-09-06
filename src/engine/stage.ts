import { images } from "../resources/images";
import { Box2, Vector2 } from "../utils/geom";
import { gameHeight, gameWidth } from "./graphics";
import { Sprite } from "./sprite";

export interface Stage {
    bounds: Box2,
    back: Sprite,
    camera: Vector2,
}

let stage: Stage | undefined;

export const getStage = () => stage!;

export const setStage = (value: Stage) => stage = value;

export const limitCamera = () => {
    const stage = getStage();
    const back = images[stage.back.image];

    if (- stage.camera.x > 0) {
        stage.camera.x = 0;
    }

    if (-stage.camera.x + back.width < gameWidth) {
        stage.camera.x = back.width - gameWidth;
    }

    if (- stage.camera.y > 0) {
        stage.camera.y = 0;
    }

    if (-stage.camera.y + back.height < gameHeight) {
        stage.camera.y = back.height - gameHeight;
    }
}