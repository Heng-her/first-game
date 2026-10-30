import type * as THREE from "three";

// =============================================================================
// MOVEMENT & CAMERA CONFIGURATION (Configurable in one centralized place)
// =============================================================================
export const MOVEMENT_CONFIG = {
  characterScale: 0.16, // Miniature city scale (តូចសមស្របនឹងទំហំទីក្រុងធំទូលាយ)
  playerRadius: 0.08, // Collision radius for physical obstacle bumping & sliding
  walkSpeed: 0.95, // units / second (WASD) - ល្បឿនដើរល្មម សុភាព
  runSpeed: 1.75, // units / second (WASD + Shift) - ល្បឿនរត់ល្មម ស្រួលបញ្ជា
  rotationSpeed: 6.5, // radians / second - បត់ឆ្វេង/ស្ដាំរលូន មិនកន្ត្រាក់ ឬលឿនពេក
  acceleration: 7.0, // speed ramp up rate - ចេញដំណើរបែបធម្មជាតិ
  deceleration: 8.5, // speed ramp down rate - ឈប់មានលំនឹង
  cameraDistance: 1.4, // close-up follow distance for miniature scale
  cameraHeight: 0.65, // low ground-level elevation
  cameraLookOffset: 0.25, // target height centered on miniature soldier
  cameraFollowSmoothing: 5.0, // position follow smoothing
  cameraRotationSmoothing: 2.2, // camera trailing smoothing (prevents oscillation)
  initialPosition: [0, 0, 1.8] as [number, number, number], // South Roundabout Plaza (free of obstacles)
};

export interface SoldierState {
  pos: THREE.Vector3;
  rotation: number;
  isMoving: boolean;
  isRunning: boolean;
  currentSpeed: number;
  forwardInput: number;
}

export interface VirtualInput {
  forward: number;
  side: number;
  isRunning: boolean;
}
