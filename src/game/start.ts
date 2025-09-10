import { getStage, setStage } from "../engine/stage"
import { clearUnits } from "../engine/unit";
import { createHero, getHero } from "./hero";
import { createMob } from "./mob";
import { getBarStage } from "./stages/bar"

export const start = () => {
    setStage(getBarStage());
    clearUnits();
    createHero();

    const stage = getStage();

    // const bob = createMob(0);
    // bob.position.x = stage.bounds.x + 100;
    // bob.position.y = stage.bounds.y + stage.bounds.h / 2;

    // const jack = createMob(1);
    // jack.position.x = stage.bounds.x + 120;
    // jack.position.y = stage.bounds.y + stage.bounds.h / 2 + 20;

    const hero = getHero();
    hero.position.x = stage.bounds.x + 50;
    hero.position.y = stage.bounds.y + 30;//stage.bounds.h / 2;
}