import { timeout } from "../../utils/browser";
import { zzfxX as audioContext, zzfxM, zzfxP, zzfxX } from "./zzfx";

const unlockAudio = (force = false) => {
  if (force || audioContext.state === "suspended") {
    audioContext.resume().catch();
  }
};

const playMusic = async (source: any) => {
  const buffer = await renderSong(source),
    node = zzfxP(...buffer);
  node.loop = true;
  zzfxX.resume();
};

const renderSong = async (song: any): Promise<any[][]> => {
  await timeout(50);
  return zzfxM(...song);
};

export { audioContext, unlockAudio, playMusic };
