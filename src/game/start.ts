import { getStage, setStage } from "../engine/stage"
import { clearUnits } from "../engine/unit";
import { createHero, getHero } from "./hero";
import { getBarStage } from "./levels/bar"

export const start = () => {
    setStage(getBarStage());
    clearUnits();
    createHero();

    const stage = getStage();
    const hero = getHero();
    hero.position.x = 50;
    hero.position.y = stage.height / 2;
}