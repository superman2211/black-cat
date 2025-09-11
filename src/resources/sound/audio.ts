import { timeout } from "../../utils/browser";
import background from "./background";
import { zzfxX as audioContext, zzfx, zzfxM, zzfxP, zzfxX } from "./zzfx";

export const musicGainNode = audioContext.createGain();
export const effectGainNode = audioContext.createGain();

musicGainNode.gain.value = 0.3;
effectGainNode.gain.value = 0.6;

const effextHit = [, , 418, .01, .01, .03, 4, 2.1, -1, , , , , .2, , .2, , .67, .03, , 107];
const effextKick = [, 1, 48, , .04, .01, 4, 1.6, 1, -26, 300, , , 1.3, , .1, , .9, .03];
const effextStep = [.3, , 391.9954, , .005, .01, 2, .4, 1, , 1700, , , 1, , .6, , .2, .005, , 6e3];

const unlockAudio = (force = false) => {
  if (force || audioContext.state === "suspended") {
    audioContext.resume().catch();
  }
};

const playMusic = async () => {
  const buffer = await renderSong(background),
    node = zzfxP(...buffer);

  node.connect(musicGainNode);
  node.loop = true;
  node.start();

  musicGainNode.connect(zzfxX.destination);

  zzfxX.resume();
};

const renderSong = async (song: any): Promise<any[][]> => {
  await timeout(50);
  return zzfxM(...song);
};

const playEffect = (effect: any) => {
  const node = zzfx(...effect);
  node.connect(effectGainNode);
  node.loop = false;

  effectGainNode.connect(zzfxX.destination);

  node.start();
}

export const playStep = () => playEffect(effextStep);
export const playHit = () => playEffect(effextHit);
export const playKick = () => playEffect(effextKick);

export { audioContext, unlockAudio, playMusic };

