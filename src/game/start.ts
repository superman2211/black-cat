import { clearEntities } from "../engine/entity";
import { getStage, setStage } from "../engine/stage"
import { clearUnits } from "../engine/unit";
import { createHero, getHero } from "./hero";
import { createMob } from "./mob";
import { getBarStage } from "./bar"

export const start = () => {
    clearUnits();
    clearEntities();

    setStage(getBarStage());

    createHero();

    const stage = getStage();

    const hero = getHero();
    hero.position.x = stage.bounds.x + 250;
    hero.position.y = stage.bounds.y + stage.bounds.h / 2;
}