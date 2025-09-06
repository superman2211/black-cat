import { gameHeight, gameWidth } from "../engine/graphics";
import { getStage } from "../engine/stage"
import { getHero } from "./hero";

export const updateCameraPosition = () => {
    const stage = getStage();
    const hero = getHero();

    stage.cameraPosition.x = hero.position.x - gameWidth / 2;
    stage.cameraPosition.y = hero.position.y - gameHeight / 2;
}