import { useRef, useState } from 'react';
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
const JUMP_VELOCITY = 8.5;
const GRAVITY = 24;

// Instant 2D cylinder pushback obstacles (0 CPU cost, rock solid)
const STATIC_OBSTACLES = [
  { x: 6.5, z: 7.5, radius: 1.8 }, // Parked Tuk-Tuk
  // Fallback tree obstacles
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
  const { camera, scene: worldScene } = useThree();

  // Starting position at (0, 4.85, 8) matching the true terrain elevation of the 3D map
  const position = useRef(new THREE.Vector3(0, 4.85, 8));
  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const [isGroundedDisplay, setIsGroundedDisplay] = useState(true);
  const [currentMovementState, setCurrentMovementState] = useState<
    'idle' | 'walk' | 'run' | 'sprint' | 'jump' | 'fall' | 'land'
  >('idle');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const landingTimer = useRef(0);
  const wasAirborne = useRef(false);
  const rotationY = useRef(0);

  // Collision Raycasters
  const horizontalRaycaster = useRef(new THREE.Raycaster());
  const downwardRaycaster = useRef(new THREE.Raycaster());
  const collidersRef = useRef<THREE.Object3D[]>([]);
  const groundCollidersRef = useRef<THREE.Object3D[]>([]);
  const frameCount = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Tick landing compression timer
    if (landingTimer.current > 0) {
      landingTimer.current = Math.max(0, landingTimer.current - delta);
    }

    // Cache colliders every 30 frames for buttery 60 FPS
    frameCount.current += 1;
    if (frameCount.current % 30 === 1 || groundCollidersRef.current.length === 0) {
      const foundGround: THREE.Object3D[] = [];
      const foundWalls: THREE.Object3D[] = [];
      const playerGroup = groupRef.current;

      worldScene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
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
            // Ground elevation: terrain, temple terraces, steps, bridge deck
            if (obj.userData?.isGround || obj.name === 'terrain' || obj.name === 'props') {
              foundGround.push(obj);
            }
            // Solid walls & obstacles: temple walls, pillars, tuk-tuk
            if (obj.userData?.isCollider || obj.name === 'props') {
              foundWalls.push(obj);
            }
          }
        }
      });
      groundCollidersRef.current = foundGround;
      collidersRef.current = foundWalls;
    }

    // 1. Raw Input Vector
    let rawMoveX = 0;
    let rawMoveZ = 0;

    if (
      controls.moveVector &&
      (Math.abs(controls.moveVector.x) > 0.05 ||
        Math.abs(controls.moveVector.y) > 0.05)
    ) {
      rawMoveX = controls.moveVector.x;
      rawMoveZ = controls.moveVector.y;
    } else {
      if (controls.forward) rawMoveZ -= 1;
      if (controls.backward) rawMoveZ += 1;
      if (controls.left) rawMoveX -= 1;
      if (controls.right) rawMoveX += 1;
    }

    // 2. Camera-Relative Movement Vector (3rd Person Standard)
    const camForward = new THREE.Vector3();
    camera.getWorldDirection(camForward);
    camForward.y = 0;
    if (camForward.lengthSq() > 0.0001) {
      camForward.normalize();
    } else {
      camForward.set(0, 0, -1);
    }
    const camRight = new THREE.Vector3(-camForward.z, 0, camForward.x).normalize();

    // Move relative to camera yaw: Forward (-Z) drives along camForward, Right (+X) drives along camRight
    const desiredMove = new THREE.Vector3()
      .addScaledVector(camForward, -rawMoveZ)
      .addScaledVector(camRight, rawMoveX);

    const isMoving = desiredMove.lengthSq() > 0.001;
    const speed = controls.run ? RUN_SPEED : WALK_SPEED;

    if (isMoving) {
      desiredMove.normalize();
      let dirX = desiredMove.x;
      let dirZ = desiredMove.z;

      // Solid Wall & Temple Obstacle Raycast Collision (No clipping through walls!)
      if (collidersRef.current.length > 0) {
        const moveVec = new THREE.Vector3(dirX, 0, dirZ);
        // Cast ray at player chest level (0.8m above feet)
        const rayStart = position.current.clone().add(new THREE.Vector3(0, 0.8, 0));

        horizontalRaycaster.current.set(rayStart, moveVec);
        horizontalRaycaster.current.far = 0.75; // Player radius buffer

        const hits = horizontalRaycaster.current.intersectObjects(
          collidersRef.current,
          true
        );
        if (hits.length > 0 && hits[0].point) {
          // Solid wall detected! Project movement along wall tangent (sliding collision)
          const normal = hits[0].face
            ? hits[0].face.normal.clone()
            : new THREE.Vector3(-dirX, 0, -dirZ);
          normal.transformDirection(hits[0].object.matrixWorld);
          normal.y = 0;
          normal.normalize();

          const dot = moveVec.dot(normal);
          if (dot < 0) {
            // Slide along the surface instead of passing through
            const slide = moveVec.clone().sub(normal.clone().multiplyScalar(dot));
            if (slide.lengthSq() > 0.01) {
              slide.normalize();
              dirX = slide.x * 0.75;
              dirZ = slide.z * 0.75;
            } else {
              // Direct impact into wall: full stop
              dirX = 0;
              dirZ = 0;
            }
          }
        }
      }

      // Update horizontal position with wall collision applied
      position.current.x += dirX * speed * delta;
      position.current.z += dirZ * speed * delta;

      // Rotate player smoothly towards movement direction
      const targetRotation = Math.atan2(dirX, dirZ);
      let diff = targetRotation - rotationY.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      rotationY.current += diff * Math.min(delta * 14, 1);
    }

    // 3. Downward Raycast for Ground & Platform Elevation (Terrain, Steps, Temple Terrace)
    let targetGroundY = 4.75;
    if (groundCollidersRef.current.length > 0) {
      // Cast down from 2.5m above player
      const downStart = position.current.clone().add(new THREE.Vector3(0, 2.5, 0));
      downwardRaycaster.current.set(downStart, new THREE.Vector3(0, -1, 0));
      downwardRaycaster.current.far = 20.0;

      const groundHits = downwardRaycaster.current.intersectObjects(
        groundCollidersRef.current,
        true
      );
      if (groundHits.length > 0) {
        // Select nearest walking surface at or below player step height (ignores ceilings/roofs above player)
        for (const hit of groundHits) {
          if (hit.point && hit.point.y <= position.current.y + 0.8) {
            targetGroundY = hit.point.y;
            break;
          }
        }
      }
    }

    // 4. Jump & Gravity Physics with Step Climbing and Ground Snapping
    if (controls.jump && isGrounded.current) {
      velocityY.current = JUMP_VELOCITY;
      isGrounded.current = false;
      wasAirborne.current = true;
    }

    if (!isGrounded.current) {
      velocityY.current -= GRAVITY * delta;
      position.current.y += velocityY.current * delta;

      if (position.current.y <= targetGroundY) {
        position.current.y = targetGroundY;
        velocityY.current = 0;
        isGrounded.current = true;
        if (wasAirborne.current) {
          landingTimer.current = 0.24; // 240ms landing impact absorption
          wasAirborne.current = false;
        }
      }
    } else {
      // Climb stairs, bridge ramps, and slopes smoothly
      const diffY = targetGroundY - position.current.y;
      if (Math.abs(diffY) < 0.65) {
        // Smoothly step up/down stairs
        position.current.y = THREE.MathUtils.lerp(
          position.current.y,
          targetGroundY,
          Math.min(delta * 16, 1)
        );
      } else if (diffY < -0.65) {
        // Walked off high terrace/cliff -> fall naturally with gravity
        isGrounded.current = false;
        wasAirborne.current = true;
      }
    }

    // 5. Solid Obstacle Push-Back (Tuk-Tuk & Trees)
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

    // 6. World boundaries (Expanded to cover the full 400m x 400m adventure map)
    position.current.x = Math.max(-190, Math.min(190, position.current.x));
    position.current.z = Math.max(-190, Math.min(190, position.current.z));

    // Apply to Three.js Object3D
    groupRef.current.position.copy(position.current);
    groupRef.current.rotation.y = rotationY.current;

    // 7. Granular Movement State Machine Calculation
    let nextState: 'idle' | 'walk' | 'run' | 'sprint' | 'jump' | 'fall' | 'land' = 'idle';
    if (!isGrounded.current) {
      nextState = velocityY.current > 0.8 ? 'jump' : 'fall';
    } else if (landingTimer.current > 0 && !isMoving) {
      nextState = 'land';
    } else if (isMoving) {
      if (controls.run) {
        nextState = speed >= 9.0 ? 'run' : 'walk';
      } else {
        nextState = 'walk';
      }
    } else {
      nextState = 'idle';
    }

    if (currentMovementState !== nextState) {
      setCurrentMovementState(nextState);
    }
    const activeSpeed = isMoving ? speed : 0;
    if (currentSpeed !== activeSpeed) {
      setCurrentSpeed(activeSpeed);
    }

    // Sync display state when grounded changes
    if (isGroundedDisplay !== isGrounded.current) {
      setIsGroundedDisplay(isGrounded.current);
    }

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
    <group ref={groupRef} position={[0, 4.85, 8]}>
      <Player
        modelUrl={modelUrl}
        isMoving={currentMovementState === 'walk' || currentMovementState === 'run' || currentMovementState === 'sprint'}
        isRunning={controls.run}
        isGrounded={isGroundedDisplay}
        movementState={currentMovementState}
        movementSpeed={currentSpeed}
        activeEmote={activeEmote}
        animationSpeed={animationSpeed}
        onAnimationsDiscovered={onAnimationsDiscovered}
      />
    </group>
  );
}
