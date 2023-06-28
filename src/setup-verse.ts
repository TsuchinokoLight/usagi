import * as VerseThree from "@verseengine/verse-three";
import { WebGLRenderer } from "three";
import idleFbx from "./assets/animation/idle.fbx?url";
import walkFbx from "./assets/animation/walk.fbx?url";
import avatarF0Png from "./assets/avatar/f0.png";
import avatarF0Vrm from "./assets/avatar/f0.vrm?url";

const VERSE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@verseengine/verse-three@1.0.0/dist/verse_core_bg.wasm";
const ENTRANCE_SERVER_URL = "https://entrance.verseengine.cloud";
const ANIMATION_MAP = {
  idle: idleFbx,
  walk: walkFbx,
};
const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];
// const range = (n: number) => [...Array(n).keys()];
export const PRESET_AVATARS = [
  {
    thumbnailURL: avatarF0Png,
    avatarURL: avatarF0Vrm,
  }
];
const DEFAULT_AVATAR_URL =
  PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)].avatarURL;

export const setupVerse = async (
  scene: THREE.Scene,
  renderer: WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  cameraContainer: THREE.Object3D,
  player: THREE.Object3D,
  collisionBoxes: THREE.Box3[],
  teleportTargetObjects: THREE.Object3D[]
) => {
  const adapter = new VerseThree.DefaultEnvAdapter(
    renderer,
    scene,
    camera,
    cameraContainer,
    player,
    () => collisionBoxes,
    () => [],
    () => teleportTargetObjects,
    {
      isLowSpecMode: true,
    }
  );
  const mayBeLowSpecDevice = VerseThree.isLowSpecDevice();
  const res = await VerseThree.start(
    adapter,
    scene,
    VERSE_WASM_URL,
    ENTRANCE_SERVER_URL,
    DEFAULT_AVATAR_URL,
    ANIMATION_MAP,
    ICE_SERVERS,
    {
      maxNumberOfPeople: mayBeLowSpecDevice ? 8 : 16,
      maxNumberOfParallelFileTransfers: mayBeLowSpecDevice ? 1 : 4,
      presetAvatars: PRESET_AVATARS,
    }
  );
  return res.tick;
};