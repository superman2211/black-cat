import { DEBUG } from "./debug";
import { initInput } from "./engine/input";
import { applyUnitsDamage, limitUnitsPositions, updateUnits, updateUnitsSpritePositions } from "./engine/unit";
import { updateHero } from "./game/hero";
import { draw, updateSize } from "./engine/graphics";
import { loadResources } from "./resources/loader";
import { playMusic } from "./resources/sound/audio";
import { calculateTime } from "./utils/time";
import { start } from "./game/start";
import { updateCameraPosition } from "./game/game";
import { limitCamera } from "./engine/stage";
import { generateMobsConfigs, updateMobs } from "./game/mob";
import { updateEffects } from "./engine/effect";
import { collisionItems } from "./engine/item";
import { controlAudio } from "./resources/sound/control";
import { generateMobs } from "./engine/waves";
import { updateJoystick } from "./engine/joystick";

if (DEBUG) {
    console.warn("debug mode");
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

const update = () => {
    calculateTime();
    updateSize();

    updateJoystick();
    generateMobs();
    updateHero();
    updateMobs();
    updateUnits();
    collisionItems();
    applyUnitsDamage();
    limitUnitsPositions();
    updateEffects();

    updateCameraPosition();
    limitCamera();
    updateUnitsSpritePositions();

    draw();

    controlAudio();

    requestAnimationFrame(update);
};

async function main() {
    await loadResources();
    playMusic();
    initInput();
    generateMobsConfigs();
    start();
    update();
}

main();