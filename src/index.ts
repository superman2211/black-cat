import { DEBUG } from "./debug";
import { initInput } from "./engine/input";
import { limitUnitsPositions, updateUnits, updateUnitsSpritePositions } from "./engine/unit";
import { updateHero } from "./game/hero";
import { draw, updateSize } from "./engine/graphics";
import { loadResources } from "./resources/loader";
import { playMusic } from "./resources/sound/audio";
import { calculateTime } from "./utils/time";
import background from "./resources/background";
import { start } from "./game/start";
import { updateCameraPosition } from "./game/game";
import { limitCamera } from "./engine/stage";
import { generateMobsConfigs, updateMobs } from "./game/mob";

if (DEBUG) {
    console.warn("debug mode");
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

const update = () => {
    calculateTime();
    updateSize();

    updateHero();
    updateMobs();
    updateUnits();
    limitUnitsPositions();

    updateCameraPosition();
    limitCamera();
    updateUnitsSpritePositions();

    draw();

    requestAnimationFrame(update);
};

async function main() {
    await loadResources();
    playMusic(background);
    initInput();
    generateMobsConfigs();
    start();
    update();
}

main();