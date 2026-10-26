import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface FollowCameraProps {
  targetPosition: [number, number, number];
  enabled?: boolean;
}

export function FollowCamera({ targetPosition, enabled = true }: FollowCameraProps) {
  const { camera, gl } = useThree();

  // Spherical orbit parameters centered on the player
  const spherical = useRef({
    radius: 6.8, // Balanced 3rd-person distance
    theta: 0,    // Horizontal rotation angle around player
    phi: Math.PI / 2.6, // Vertical pitch angle (~70 deg, comfortable looking-down angle)
  });

  const isDragging = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });

  // Initial vectors matching starting player position (Y = 4.85)
  const initialCenterY = targetPosition[1] + 1.05;
  const currentCameraPos = useRef(
    new THREE.Vector3(
      targetPosition[0],
      initialCenterY + 6.8 * Math.cos(Math.PI / 2.6),
      targetPosition[2] + 6.8 * Math.sin(Math.PI / 2.6)
    )
  );
  const currentLookAt = useRef(
    new THREE.Vector3(targetPosition[0], initialCenterY, targetPosition[2])
  );

  // Mouse & Touch Drag to smoothly orbit around the player while keeping player centered
  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      // Start drag on left mouse click (0), right mouse click (2), or touch
      if (e.button === 0 || e.button === 2) {
        isDragging.current = true;
        previousPointer.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      // Prevent browser right-click menu during camera look
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !enabled) return;
      const dx = e.clientX - previousPointer.current.x;
      const dy = e.clientY - previousPointer.current.y;
      previousPointer.current = { x: e.clientX, y: e.clientY };

      // Horizontal orbit
      spherical.current.theta -= dx * 0.005;
      // Vertical pitch clamped so camera never goes under the ground or flips over
      spherical.current.phi = Math.max(
        0.25,
        Math.min(Math.PI / 2 - 0.06, spherical.current.phi - dy * 0.005)
      );
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!enabled) return;
      // Smooth zoom in/out between 3.5m and 13m
      spherical.current.radius = Math.max(
        3.5,
        Math.min(13.0, spherical.current.radius + e.deltaY * 0.008)
      );
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
    };
  }, [gl, enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;

    // 1. Center of the Character (1.8m height -> exact center is at Y + 1.05m)
    // Aiming optical axis directly at this point locks the player in the DEAD-CENTER of the screen!
    const targetCenterY = targetPosition[1] + 1.05;
    const lookAtTarget = new THREE.Vector3(
      targetPosition[0],
      targetCenterY,
      targetPosition[2]
    );

    // 2. Calculate camera position on the sphere surrounding the player's center
    const { radius, theta, phi } = spherical.current;
    const sinPhiRadius = Math.sin(phi) * radius;

    const desiredX = targetPosition[0] + sinPhiRadius * Math.sin(theta);
    const desiredY = targetCenterY + radius * Math.cos(phi);
    const desiredZ = targetPosition[2] + sinPhiRadius * Math.cos(theta);
    const desiredCameraPos = new THREE.Vector3(desiredX, desiredY, desiredZ);

    // 3. Synchronized smooth damping (9x delta) prevents player from drifting off-center while moving
    const lerpRate = Math.min(delta * 9, 1);
    currentCameraPos.current.lerp(desiredCameraPos, lerpRate);
    currentLookAt.current.lerp(lookAtTarget, lerpRate);

    // 4. Update Three.js camera
    camera.position.copy(currentCameraPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
