import { DEBUG } from "./debug";
import { draw, updateSize } from "./graphics";
import { loadResources } from "./resources/loader";
import { calculateTime } from "./utils/time";

if (DEBUG) {
    console.warn("debug mode");
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

const update = () => {
    calculateTime();
    updateSize();
    draw();
    requestAnimationFrame(update);
};

async function main() {
    await loadResources();
    // initInput();
    update();
}

main();