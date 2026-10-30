import { useRef, useEffect, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MOVEMENT_CONFIG, type SoldierState } from "../../data/soldierConfig";

interface RoadFollowCameraProps {
  soldierStateRef: RefObject<SoldierState | null>;
  enabled: boolean;
}

// Module-level scratch vectors to prevent garbage collection and satisfy React immutability rules
const _tempTargetPos = new THREE.Vector3();
const _tempLookTarget = new THREE.Vector3();

export function RoadFollowCamera({
  soldierStateRef,
  enabled,
}: RoadFollowCameraProps) {
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.3, 0));

  // Camera angles: Yaw (horizontal 360° rotation) and Pitch (vertical elevation)
  const cameraYawRef = useRef<number>(0);
  const cameraPitchRef = useRef<number>(0.28); // default comfortable ~16° elevation

  // User manual drag tracking (mouse or touch)
  const isDraggingRef = useRef<boolean>(false);
  const activePointerIdRef = useRef<number | null>(null);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastUserOrbitTimeRef = useRef<number>(0);

  // Attach Pointer Event Listeners for Mouse Click-Drag & Mobile Touch-Drag
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      // Ignore clicks on UI buttons (like back button) or virtual joystick
      const target = e.target as HTMLElement | null;
      if (target?.closest("button, [data-control='true']")) return;

      isDraggingRef.current = true;
      activePointerIdRef.current = e.pointerId;
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
      lastUserOrbitTimeRef.current = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || e.pointerId !== activePointerIdRef.current) return;

      const dx = e.clientX - lastPointerPosRef.current.x;
      const dy = e.clientY - lastPointerPosRef.current.y;
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };

      const SENSITIVITY_X = 0.0055;
      const SENSITIVITY_Y = 0.0035;

      // Horizontal drag: rotate camera around character (look left / look right)
      cameraYawRef.current -= dx * SENSITIVITY_X;

      // Vertical drag: adjust camera pitch elevation (look up / look down)
      cameraPitchRef.current = THREE.MathUtils.clamp(
        cameraPitchRef.current + dy * SENSITIVITY_Y,
        0.05, // Minimum elevation above ground (~3 degrees)
        1.18  // Maximum overhead angle (~67 degrees)
      );

      lastUserOrbitTimeRef.current = performance.now();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerId === activePointerIdRef.current) {
        isDraggingRef.current = false;
        activePointerIdRef.current = null;
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      isDraggingRef.current = false;
      activePointerIdRef.current = null;
    };
  }, [enabled]);

  // Per-frame camera positioning and target tracking
  useFrame(({ camera }, delta) => {
    if (!enabled || !soldierStateRef.current) return;

    const { pos, rotation, isMoving, forwardInput } = soldierStateRef.current;
    const dt = Math.min(delta, 0.1);

    // Gently auto-align camera behind character ONLY when actively moving forward (W)
    // and if the user hasn't manually orbited the camera recently (> 1.2s)
    const timeSinceOrbit = performance.now() - lastUserOrbitTimeRef.current;
    if (!isDraggingRef.current && timeSinceOrbit > 1200 && isMoving && forwardInput > 0) {
      let diff = rotation - cameraYawRef.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      cameraYawRef.current +=
        diff * Math.min(1, dt * MOVEMENT_CONFIG.cameraRotationSmoothing);
    }

    // Spherical position around the character based on current Yaw & Pitch
    const pitch = cameraPitchRef.current;
    const yaw = cameraYawRef.current;
    const hDist = MOVEMENT_CONFIG.cameraDistance * Math.cos(pitch);
    const vDist = MOVEMENT_CONFIG.cameraDistance * Math.sin(pitch);

    _tempTargetPos.set(
      pos.x - Math.sin(yaw) * hDist,
      pos.y + MOVEMENT_CONFIG.cameraLookOffset + vDist,
      pos.z - Math.cos(yaw) * hDist
    );

    // Smooth position damping
    camera.position.lerp(
      _tempTargetPos,
      Math.min(1, dt * MOVEMENT_CONFIG.cameraFollowSmoothing)
    );

    // Focus target centered on soldier's upper body / head
    _tempLookTarget.set(
      pos.x,
      pos.y + MOVEMENT_CONFIG.cameraLookOffset,
      pos.z
    );

    currentLookAt.current.lerp(
      _tempLookTarget,
      Math.min(1, dt * (MOVEMENT_CONFIG.cameraFollowSmoothing + 2.0))
    );

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
