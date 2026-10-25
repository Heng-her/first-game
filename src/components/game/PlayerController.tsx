import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
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

// Static obstacle cylinder colliders for instant airtight pushback
const STATIC_OBSTACLES = [
  { x: 6.5, z: 7.5, radius: 1.6 }, // Tuk-Tuk
  // Sugar palm trees
  { x: -14, z: -10, radius: 0.7 },
  { x: -18, z: 5, radius: 0.7 },
  { x: -10, z: 15, radius: 0.7 },
  { x: -22, z: -20, radius: 0.7 },
  { x: 12, z: -15, radius: 0.7 },
  { x: 15, z: 12, radius: 0.7 },
  { x: -8, z: -25, radius: 0.7 },
  { x: 10, z: -28, radius: 0.7 },
  { x: -15, z: 30, radius: 0.7 },
  { x: 8, z: 26, radius: 0.7 },
];

export function PlayerController({
  controls,
  onStateChange,
  modelUrl,
  activeEmote,
  animationSpeed,
  onAnimationsDiscovered,
}: PlayerControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene: worldScene } = useThree();
  
  // State refs for 60fps frame loop
  const position = useRef(new THREE.Vector3(0, 0, 8));
  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const rotationY = useRef(0);

  // Collision Raycasters
  const horizontalRaycaster = useRef(new THREE.Raycaster());
  const downwardRaycaster = useRef(new THREE.Raycaster());
  const collidersRef = useRef<THREE.Object3D[]>([]);
  const frameCount = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Cache collider meshes every 60 frames (~1 sec) for maximum performance
    frameCount.current += 1;
    if (frameCount.current % 60 === 1 || collidersRef.current.length === 0) {
      const found: THREE.Object3D[] = [];
      const playerGroup = groupRef.current;
      worldScene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh && obj.userData?.isCollider) {
          // Check that mesh does not belong to the player
          let isPlayerPart = false;
          let curr: THREE.Object3D | null = obj;
          while (curr) {
            if (curr === playerGroup) {
              isPlayerPart = true;
              break;
            }
            curr = curr.parent;
          }
          if (!isPlayerPart) {
            found.push(obj);
          }
        }
      });
      collidersRef.current = found;
    }

    // Movement calculation
    let moveX = 0;
    let moveZ = 0;

    if (
      controls.moveVector &&
      (Math.abs(controls.moveVector.x) > 0.05 ||
        Math.abs(controls.moveVector.y) > 0.05)
    ) {
      moveX = controls.moveVector.x;
      moveZ = controls.moveVector.y;
    } else {
      if (controls.forward) moveZ -= 1;
      if (controls.backward) moveZ += 1;
      if (controls.left) moveX -= 1;
      if (controls.right) moveX += 1;
    }

    const isMoving = moveX !== 0 || moveZ !== 0;
    const speed = controls.run ? RUN_SPEED : WALK_SPEED;

    if (isMoving) {
      // Normalize direction
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      let dirX = moveX / len;
      let dirZ = moveZ / len;

      // 1. Raycast Wall & Temple Obstacle Collision Detection
      if (collidersRef.current.length > 0) {
        const moveVec = new THREE.Vector3(dirX, 0, dirZ);
        const rayStart = position.current.clone().add(new THREE.Vector3(0, 0.8, 0));
        
        horizontalRaycaster.current.set(rayStart, moveVec);
        horizontalRaycaster.current.far = 0.65; // Player radius buffer

        const hits = horizontalRaycaster.current.intersectObjects(collidersRef.current, true);
        if (hits.length > 0 && hits[0].point) {
          // Wall detected! Slide smoothly along surface normal instead of clipping
          const normal = hits[0].face ? hits[0].face.normal.clone() : new THREE.Vector3(-dirX, 0, -dirZ);
          normal.transformDirection(hits[0].object.matrixWorld);
          normal.y = 0;
          normal.normalize();

          const dot = moveVec.dot(normal);
          if (dot < 0) {
            // Project movement along wall tangent (Sliding Collision)
            const slide = moveVec.clone().sub(normal.clone().multiplyScalar(dot));
            if (slide.lengthSq() > 0.01) {
              slide.normalize();
              dirX = slide.x * 0.75;
              dirZ = slide.z * 0.75;
            } else {
              dirX = 0;
              dirZ = 0;
            }
          }
        }
      }

      // Update position with sliding collision
      position.current.x += dirX * speed * delta;
      position.current.z += dirZ * speed * delta;

      // Rotate player smoothly towards movement direction
      const targetRotation = Math.atan2(moveX, moveZ);
      let diff = targetRotation - rotationY.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      rotationY.current += diff * Math.min(delta * 12, 1);
    }

    // 2. Downward Raycast for Ground & Platform Elevation (Stairs & Temple floors)
    let targetGroundY = 0;
    if (collidersRef.current.length > 0) {
      const downStart = position.current.clone().add(new THREE.Vector3(0, 2.5, 0));
      downwardRaycaster.current.set(downStart, new THREE.Vector3(0, -1, 0));
      downwardRaycaster.current.far = 6.0;

      const groundHits = downwardRaycaster.current.intersectObjects(collidersRef.current, true);
      if (groundHits.length > 0 && groundHits[0].point) {
        targetGroundY = Math.max(0, groundHits[0].point.y);
      }
    }

    // 3. Jump & Gravity Physics with Ground Snapping
    if (controls.jump && isGrounded.current) {
      velocityY.current = JUMP_VELOCITY;
      isGrounded.current = false;
    }

    if (!isGrounded.current) {
      velocityY.current -= GRAVITY * delta;
      position.current.y += velocityY.current * delta;

      if (position.current.y <= targetGroundY) {
        position.current.y = targetGroundY;
        velocityY.current = 0;
        isGrounded.current = true;
      }
    } else {
      // Step up/down for stairs and elevated temple platforms smoothly
      const diffY = targetGroundY - position.current.y;
      if (Math.abs(diffY) < 0.65) {
        position.current.y = THREE.MathUtils.lerp(position.current.y, targetGroundY, Math.min(delta * 16, 1));
      } else if (diffY < -0.65) {
        // Stepped off elevated ledge -> fall with gravity
        isGrounded.current = false;
      }
    }

    // 4. Solid Obstacle Push-Back (Tuk-Tuk & Trees)
    for (const obs of STATIC_OBSTACLES) {
      const dx = position.current.x - obs.x;
      const dz = position.current.z - obs.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const minDist = obs.radius + 0.45;
      if (dist < minDist && dist > 0.001) {
        position.current.x = obs.x + (dx / dist) * minDist;
        position.current.z = obs.z + (dz / dist) * minDist;
      }
    }

    // 5. World boundaries
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
