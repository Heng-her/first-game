import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Player } from './Player';
import type { PlayerControls, PlayerState } from '../../types/game';

interface PlayerControllerProps {
  controls: PlayerControls;
  onStateChange: (state: PlayerState) => void;
  modelUrl?: string;
  activeEmote?: string | null;
  animationSpeed?: number;
  onAnimationsDiscovered?: (names: string[]) => void;
}

const WALK_SPEED = 5;
const RUN_SPEED = 9;
const JUMP_VELOCITY = 8;
const GRAVITY = 22;

export function PlayerController({
  controls,
  onStateChange,
  modelUrl,
  activeEmote,
  animationSpeed,
  onAnimationsDiscovered,
}: PlayerControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // State refs for 60fps frame loop
  const position = useRef(new THREE.Vector3(0, 0, 8));
  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const rotationY = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Movement calculation
    let moveX = 0;
    let moveZ = 0;

    if (controls.forward) moveZ -= 1;
    if (controls.backward) moveZ += 1;
    if (controls.left) moveX -= 1;
    if (controls.right) moveX += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;
    const speed = controls.run ? RUN_SPEED : WALK_SPEED;

    if (isMoving) {
      // Normalize direction
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      const dirX = moveX / len;
      const dirZ = moveZ / len;

      // Update position
      position.current.x += dirX * speed * delta;
      position.current.z += dirZ * speed * delta;

      // Rotate player smoothly towards movement direction
      const targetRotation = Math.atan2(dirX, dirZ);
      // Smooth interpolation for rotation
      let diff = targetRotation - rotationY.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      rotationY.current += diff * Math.min(delta * 12, 1);
    }

    // Jump & Gravity physics
    if (controls.jump && isGrounded.current) {
      velocityY.current = JUMP_VELOCITY;
      isGrounded.current = false;
    }

    if (!isGrounded.current) {
      velocityY.current -= GRAVITY * delta;
      position.current.y += velocityY.current * delta;

      if (position.current.y <= 0) {
        position.current.y = 0;
        velocityY.current = 0;
        isGrounded.current = true;
      }
    }

    // World boundaries (keep player inside map)
    position.current.x = Math.max(-48, Math.min(48, position.current.x));
    position.current.z = Math.max(-48, Math.min(48, position.current.z));

    // Apply to Three.js Object3D
    groupRef.current.position.copy(position.current);
    groupRef.current.rotation.y = rotationY.current;

    // Report state back to parent (HUD, camera, coin collisions)
    onStateChange({
      position: [position.current.x, position.current.y, position.current.z],
      rotation: rotationY.current,
      isMoving,
      isRunning: controls.run && isMoving,
      isGrounded: isGrounded.current,
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 8]}>
      <Player
        modelUrl={modelUrl}
        isMoving={controls.forward || controls.backward || controls.left || controls.right}
        isRunning={controls.run}
        isGrounded={isGrounded.current}
        activeEmote={activeEmote}
        animationSpeed={animationSpeed}
        onAnimationsDiscovered={onAnimationsDiscovered}
      />
    </group>
  );
}
