import { Vector2 } from "../utils/geom";
import { Sprite } from "./sprite";

export interface Stage {
    width: number,
    height: number,
    floor: Sprite,
    cameraPosition: Vector2,
}

let stage: Stage | undefined;

export const getStage = () => stage!;

export const setStage = (value: Stage) => stage = value;