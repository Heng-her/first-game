import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { MOVEMENT_CONFIG, type SoldierState, type VirtualInput } from "../../data/soldierConfig";
import { resolveMovementCollision } from "../../utils/collisionSystem";

interface PlayableSoldierProps {
  soldierStateRef: React.RefObject<SoldierState>;
  onKeyChange?: (keys: { w: boolean; a: boolean; s: boolean; d: boolean; shift: boolean }) => void;
  virtualInputRef?: React.RefObject<VirtualInput>;
}

// Module-level scratch vectors to prevent garbage collection and satisfy React immutability rules
const _cameraForward = new THREE.Vector3();
const _cameraRight = new THREE.Vector3();
const _moveDirection = new THREE.Vector3();

export function PlayableSoldier({
  soldierStateRef,
  onKeyChange,
  virtualInputRef,
}: PlayableSoldierProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentActionRef = useRef<"Idle" | "Walk" | "Run">("Idle");
  const currentSpeedRef = useRef<number>(0);

  // Active keyboard inputs
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // 1. Load Soldier.glb using existing Three.js / Drei asset pipeline
  const gltf = useGLTF("/models/characters/Soldier.glb");

  // Safely clone skinned mesh
  const clonedScene = useMemo(() => {
    const clone = cloneSkeleton(gltf.scene);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = THREE.MathUtils.clamp(mat.roughness ?? 0.6, 0.3, 0.85);
          mat.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [gltf.scene]);

  // 2. Bind animations ('Idle', 'Walk', 'Run', 'TPose')
  const { actions } = useAnimations(gltf.animations, groupRef);

  // Initialize animations and start with Idle
  useEffect(() => {
    if (!actions) return;

    // Configure loop on playable actions (do NOT play TPose)
    ["Idle", "Walk", "Run"].forEach((animName) => {
      const action = actions[animName];
      if (action) {
        action.clampWhenFinished = false;
        action.loop = THREE.LoopRepeat;
      }
    });

    // Start with Idle
    const idleAction = actions.Idle;
    if (idleAction) {
      idleAction.reset().fadeIn(0.2).play();
      currentActionRef.current = "Idle";
    }

    return () => {
      Object.values(actions).forEach((action) => action?.stop());
    };
  }, [actions]);

  // 3. Keyboard Event Listeners (WASD + Shift)
  useEffect(() => {
    const reportKeyChange = () => {
      if (onKeyChange) {
        onKeyChange({
          w: !!keysPressed.current["w"] || !!keysPressed.current["arrowup"],
          a: !!keysPressed.current["a"] || !!keysPressed.current["arrowleft"],
          s: !!keysPressed.current["s"] || !!keysPressed.current["arrowdown"],
          d: !!keysPressed.current["d"] || !!keysPressed.current["arrowright"],
          shift: !!keysPressed.current["shift"],
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in form fields
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      keysPressed.current[key] = true;

      // Prevent browser default scroll for game controls
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          " ",
        ].includes(key)
      ) {
        e.preventDefault();
      }

      reportKeyChange();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = false;
      reportKeyChange();
    };

    const handleBlur = () => {
      // Clear all keys on window blur to prevent stuck movement
      keysPressed.current = {};
      reportKeyChange();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      keysPressed.current = {};
    };
  }, [onKeyChange]);

  // 4. Per-frame physics, movement, smooth rotation, and animation state transitions
  useFrame(({ camera }, delta) => {
    if (!groupRef.current) return;

    // Clamp delta to prevent huge jumps if browser tab was suspended
    const dt = Math.min(delta, 0.1);

    // Read input states (Keyboard)
    const k = keysPressed.current;
    let forward = (k["w"] || k["arrowup"] ? 1 : 0) - (k["s"] || k["arrowdown"] ? 1 : 0);
    let side = (k["d"] || k["arrowright"] ? 1 : 0) - (k["a"] || k["arrowleft"] ? 1 : 0);
    let isRunning = (forward !== 0 || side !== 0) && (!!k["shift"] || !!k["shiftleft"] || !!k["shiftright"]);

    // Merge virtual touch joystick input for mobile
    if (virtualInputRef?.current) {
      const v = virtualInputRef.current;
      if (Math.abs(v.forward) > 0.05 || Math.abs(v.side) > 0.05) {
        forward = v.forward;
        side = v.side;
        if (v.isRunning) isRunning = true;
      }
    }

    const isMoving = Math.abs(forward) > 0.05 || Math.abs(side) > 0.05;

    // Calculate target speed with acceleration & deceleration
    const targetSpeed = !isMoving
      ? 0
      : isRunning
      ? MOVEMENT_CONFIG.runSpeed
      : MOVEMENT_CONFIG.walkSpeed;

    const rate = isMoving
      ? MOVEMENT_CONFIG.acceleration
      : MOVEMENT_CONFIG.deceleration;

    currentSpeedRef.current = THREE.MathUtils.lerp(
      currentSpeedRef.current,
      targetSpeed,
      dt * rate
    );

    // -------------------------------------------------------------------------
    // Animation Blending (Idle -> Walk -> Run)
    // -------------------------------------------------------------------------
    let nextActionName: "Idle" | "Walk" | "Run" = "Idle";
    if (isMoving) {
      nextActionName = isRunning ? "Run" : "Walk";
    }

    if (currentActionRef.current !== nextActionName && actions) {
      const currentAction = actions[currentActionRef.current];
      const nextAction = actions[nextActionName];

      if (currentAction && nextAction) {
        currentAction.fadeOut(0.2);
        nextAction.reset().fadeIn(0.2).play();
        currentActionRef.current = nextActionName;
      }
    }

    // -------------------------------------------------------------------------
    // Camera-relative direction calculation
    // -------------------------------------------------------------------------
    if (isMoving) {
      // Horizontal forward vector of camera
      _cameraForward.set(0, 0, -1).applyQuaternion(camera.quaternion);
      _cameraForward.y = 0;
      _cameraForward.normalize();

      // Horizontal right vector of camera
      _cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
      _cameraRight.y = 0;
      _cameraRight.normalize();

      // Combine forward and side vectors and normalize diagonal movement
      _moveDirection.set(0, 0, 0);
      _moveDirection.addScaledVector(_cameraForward, forward);
      _moveDirection.addScaledVector(_cameraRight, side);
      _moveDirection.normalize();

      // Smooth rotation toward movement direction
      const targetAngle = Math.atan2(_moveDirection.x, _moveDirection.z);
      let angleDiff = targetAngle - groupRef.current.rotation.y;

      // Wrap angle to [-PI, PI] for shortest rotation path
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

      groupRef.current.rotation.y +=
        angleDiff * Math.min(1, dt * MOVEMENT_CONFIG.rotationSpeed);
    }

    // -------------------------------------------------------------------------
    // Position Update with Physical Collision Detection & Sliding
    // -------------------------------------------------------------------------
    if (currentSpeedRef.current > 0.01) {
      const currentX = groupRef.current.position.x;
      const currentZ = groupRef.current.position.z;
      const moveDist = currentSpeedRef.current * dt;

      const nextX = currentX + _moveDirection.x * moveDist;
      const nextZ = currentZ + _moveDirection.z * moveDist;

      // Resolve collisions against all city obstacles, trees, Tuk-Tuks & river walls
      const [resolvedX, resolvedZ] = resolveMovementCollision(
        currentX,
        currentZ,
        nextX,
        nextZ,
        MOVEMENT_CONFIG.playerRadius
      );

      groupRef.current.position.x = resolvedX;
      groupRef.current.position.z = resolvedZ;
    }

    // Grounding check: Ensure soldier is grounded (bridges are slightly elevated at x=10)
    const posX = groupRef.current.position.x;
    const posZ = groupRef.current.position.z;

    // Detect if crossing any of the 3 elevated river bridges at x = 10
    const isBridge1 = Math.abs(posX - 10) <= 2.2 && Math.abs(posZ - 0) <= 1.2;
    const isBridge2 = Math.abs(posX - 10) <= 2.2 && Math.abs(posZ - (-14)) <= 1.2;
    const isBridge3 = Math.abs(posX - 10) <= 2.2 && Math.abs(posZ - 14) <= 1.2;

    const targetY = isBridge1 || isBridge2 || isBridge3 ? 0.08 : 0.02;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      dt * 12
    );

    // -------------------------------------------------------------------------
    // Report state to parent / follow camera
    // -------------------------------------------------------------------------
    if (soldierStateRef.current) {
      soldierStateRef.current.pos.copy(groupRef.current.position);
      soldierStateRef.current.rotation = groupRef.current.rotation.y;
      soldierStateRef.current.isMoving = isMoving;
      soldierStateRef.current.isRunning = isRunning;
      soldierStateRef.current.currentSpeed = currentSpeedRef.current;
      soldierStateRef.current.forwardInput = forward;
    }
  });

  return (
    <group ref={groupRef} position={MOVEMENT_CONFIG.initialPosition}>
      {/* 
        Rotate inner model by Math.PI (180 degrees) so its face matches Three.js +Z forward convention.
        Scale proportionally with MOVEMENT_CONFIG.characterScale so it matches roads and vehicles.
      */}
      <group
        rotation={[0, Math.PI, 0]}
        scale={[
          MOVEMENT_CONFIG.characterScale,
          MOVEMENT_CONFIG.characterScale,
          MOVEMENT_CONFIG.characterScale,
        ]}
      >
        <primitive object={clonedScene} />
      </group>

      {/* Ground Contact Shadow Disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.38 * MOVEMENT_CONFIG.characterScale, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>

      {/* Cambodian Player Aura Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry
          args={[
            0.45 * MOVEMENT_CONFIG.characterScale,
            0.52 * MOVEMENT_CONFIG.characterScale,
            32,
          ]}
        />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/characters/Soldier.glb");
