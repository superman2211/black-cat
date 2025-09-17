import { clearEntities } from "../engine/entity";
import { getStage, setStage } from "../engine/stage"
import { clearUnits } from "../engine/unit";
import { createHero, getHero } from "./hero";
import { getBarStage } from "./bar"
import { initWaves } from "../engine/waves";
import { anyKey } from "../engine/input";
import { game, GameState } from "../engine/game";
import { deltaS } from "../utils/time";

export const start = () => {
    clearUnits();
    clearEntities();
    initWaves();

    setStage(getBarStage());

    createHero();

    const stage = getStage();

    const hero = getHero();
    hero.position.x = stage.bounds.x + 50;
    hero.position.y = stage.bounds.y + stage.bounds.h / 2;
}

export const startAgain = () => {
    game.timout += deltaS;
    if (game.timout > 3) {
        if (anyKey) {
            game.state = GameState.Game;
            start();
        }
    }
}