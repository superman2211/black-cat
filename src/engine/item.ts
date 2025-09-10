import { Box2, Vector2 } from "../utils/geom";
import { mathMin } from "../utils/math";
import { Entity } from "./entity";
import { getStage } from "./stage";
import { units } from "./unit";

export interface Item extends Entity {
    offset: Vector2,
    bounds: Box2,
}

export const collisionItems = () => {
    const stage = getStage();

    for (const unit of units) {
        for (const item of stage.items) {
            let minX = item.position.x + item.bounds.x;
            let minY = item.position.y + item.bounds.y;

            let maxX = minX + item.bounds.w;
            let maxY = minY + item.bounds.h;

            const left = unit.position.x - minX;
            const top = unit.position.y - minY;
            const right = maxX - unit.position.x;
            const bottom = maxY - unit.position.y;

            if (left > 0 && top > 0 && right > 0 && bottom > 0) {
                const min = mathMin(left, top, right, bottom);

                if (left == min) {
                    unit.position.x -= left;
                }

                if (top == min) {
                    unit.position.y -= top;
                }

                if (right == min) {
                    unit.position.x += right;
                }

                if (bottom == min) {
                    unit.position.y += bottom;
                }
            }
        }
    }
}