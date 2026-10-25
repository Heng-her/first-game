export interface PlayerControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
  jump: boolean;
  moveVector?: { x: number; y: number };
}

export interface PlayerState {
  position: [number, number, number];
  rotation: number;
  isMoving: boolean;
  isRunning: boolean;
  isGrounded: boolean;
}

export interface CollectibleItem {
  id: string;
  position: [number, number, number];
  name: string;
  nameKm: string;
  points: number;
  collected: boolean;
}

export interface CharacterModelInfo {
  id: string;
  name: string;
  nameKm: string;
  path: string;
  descriptionKm: string;
}

export interface AnimationClipInfo {
  name: string;
  duration: number;
}

