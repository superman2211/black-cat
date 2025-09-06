import { gameHeight, gameWidth } from "../engine/graphics";
import { getStage } from "../engine/stage";
import { getHero } from "./hero";

export const updateCameraPosition = () => {
    const stage = getStage();
    const hero = getHero();

    stage.camera.x = hero.position.x - gameWidth / 2;
    stage.camera.y = hero.position.y - gameHeight / 2;
}