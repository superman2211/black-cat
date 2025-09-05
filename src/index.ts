import { DEBUG } from "./debug";
import { initInput } from "./engine/input";
import { updateUnits } from "./engine/unit";
import { updateHero } from "./game/hero";
import { draw, updateSize } from "./graphics";
import { loadResources } from "./resources/loader";
import { playMusic } from "./resources/sound/audio";
import { calculateTime } from "./utils/time";
import background from "./resources/background";

if (DEBUG) {
    console.warn("debug mode");
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

const update = () => {
    calculateTime();
    updateSize();

    updateHero();
    updateUnits();

    draw();

    requestAnimationFrame(update);
};

async function main() {
    await loadResources();
    playMusic(background);
    initInput();
    update();
}

main();