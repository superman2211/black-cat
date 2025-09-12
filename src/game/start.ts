import { clearEntities } from "../engine/entity";
import { getStage, setStage } from "../engine/stage"
import { clearUnits } from "../engine/unit";
import { createHero, getHero } from "./hero";
import { getBarStage } from "./bar"
import { initWaves } from "../engine/waves";
import { anyKey } from "../engine/input";
import { game, GameState } from "../engine/game";

export const start = () => {
    clearUnits();
    clearEntities();
    initWaves();

    setStage(getBarStage());

    createHero();

    const stage = getStage();

    const hero = getHero();
    hero.position_.x = stage.bounds_.x + 50;
    hero.position_.y = stage.bounds_.y + stage.bounds_.h / 2;
}

export const startAgain = () => {
    if (anyKey) {
        game.state = GameState.Game;
        start();
    }
}