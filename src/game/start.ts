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
    hero.position.x = stage.bounds.x + 50;
    hero.position.y = stage.bounds.y + stage.bounds.h / 2;
}