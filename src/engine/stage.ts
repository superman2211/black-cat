import { images } from "../resources/images";
import { Box2, Vector2 } from "../utils/geom";
import { entities, Entity } from "./entity";
import { gameHeight, gameWidth } from "./graphics";
import { Item } from "./item";
import { Sprite } from "./sprite";

export interface Stage {
    bounds: Box2,
    back: Sprite,
    camera: Vector2,
    items: Array<Item>,
}

let stage: Stage | undefined;

export const getStage = () => stage!;

export const setStage = (value: Stage) => {
    stage = value;

    for (const item of stage.items) {
        item.sprite.x = item.position.x - item.offset.x;
        item.sprite.y = item.position.y - item.offset.y;

        if (item.shadow) {
            item.shadow.x = item.position.x - item.offset.x;
            item.shadow.y = item.position.y - item.offset.y * item.shadow.scaleY!;
        }

        entities.push(item);
    }
}

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