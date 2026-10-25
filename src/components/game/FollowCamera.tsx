import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface FollowCameraProps {
  targetPosition: [number, number, number];
  enabled?: boolean;
}

export function FollowCamera({ targetPosition, enabled = true }: FollowCameraProps) {
  const { camera } = useThree();
  const currentCameraPos = useRef(new THREE.Vector3(0, 5, 16));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.5, 0));

  useFrame((_, delta) => {
    if (!enabled) return;

    // Desired camera position relative to player
    const desiredX = targetPosition[0];
    const desiredY = targetPosition[1] + 4.5;
    const desiredZ = targetPosition[2] + 9;

    const targetVec = new THREE.Vector3(desiredX, desiredY, desiredZ);
    const lookAtTarget = new THREE.Vector3(
      targetPosition[0],
      targetPosition[1] + 1.6,
      targetPosition[2]
    );

    // Smooth lerp for buttery camera movement
    currentCameraPos.current.lerp(targetVec, Math.min(delta * 4, 1));
    currentLookAt.current.lerp(lookAtTarget, Math.min(delta * 6, 1));

    camera.position.copy(currentCameraPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
