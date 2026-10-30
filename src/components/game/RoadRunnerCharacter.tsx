import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { getActiveCharacter } from "../../data/characters";
import { ROAD_CIRCUIT_WAYPOINTS } from "../../data/roadCircuit";

interface RoadRunnerCharacterProps {
  speedMultiplier?: number;
  isPaused?: boolean;
  onPositionUpdate?: (pos: THREE.Vector3, tangent: THREE.Vector3) => void;
}

// Module-level scratch vectors (avoids React render mutability rules and reduces garbage collection)
const _currentPos = new THREE.Vector3();
const _tangent = new THREE.Vector3();

export function RoadRunnerCharacter({
  speedMultiplier = 1.0,
  isPaused = false,
  onPositionUpdate,
}: RoadRunnerCharacterProps) {
  const runnerGroupRef = useRef<THREE.Group>(null);
  const progressRef = useRef<number>(0);
  const activeChar = useMemo(() => getActiveCharacter(), []);

  // 1. Build smooth spline curve along the road waypoints
  const roadCurve = useMemo(() => {
    const points = ROAD_CIRCUIT_WAYPOINTS.map(
      ([x, y, z]) => new THREE.Vector3(x, y, z)
    );
    return new THREE.CatmullRomCurve3(points, true, "centripetal", 0.3);
  }, []);

  // 2. Load model
  const gltf = useGLTF(activeChar.modelPath);

  // Clone skeleton safely
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

  // Bind animation
  const { actions } = useAnimations(gltf.animations, runnerGroupRef);

  useEffect(() => {
    if (!actions) return;
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0) {
      const activeAnim = actions["mixamo.com"] || actions[actionNames[0]];
      if (activeAnim) {
        activeAnim.reset().fadeIn(0.2).play();
        activeAnim.setEffectiveTimeScale(isPaused ? 0 : speedMultiplier);
      }
    }
  }, [actions, isPaused, speedMultiplier]);

  // 3. Compute scale normalization so the runner matches realistic street scale (~1.65m)
  const { scaleFactor, yOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const min = box.min;

    let s = 1.0;
    if (size.y > 10) {
      s = 1.65 / size.y; // Centimeter export to meter
    } else if (size.y > 0.1) {
      s = 1.65 / size.y;
    }

    const offset = -(min.y * s);
    return { scaleFactor: s, yOffset: offset };
  }, [clonedScene]);

  // 4. Update runner position along road curve on every frame
  useFrame((_, delta) => {
    if (!runnerGroupRef.current) return;

    if (!isPaused) {
      // Normal run speed: complete 85m loop in ~25-30s
      const baseSpeed = 0.038 * speedMultiplier;
      progressRef.current = (progressRef.current + delta * baseSpeed) % 1;
    }

    const t = progressRef.current;
    roadCurve.getPointAt(t, _currentPos);
    roadCurve.getTangentAt(t, _tangent);

    runnerGroupRef.current.position.copy(_currentPos);

    // Rotate runner to face direction of road travel
    const angle = Math.atan2(_tangent.x, _tangent.z);
    runnerGroupRef.current.rotation.y = angle;

    // Report position & tangent for follow camera
    if (onPositionUpdate) {
      onPositionUpdate(_currentPos, _tangent);
    }
  });

  return (
    <group ref={runnerGroupRef}>
      {/* 3D Character Model with automatic scale & grounded feet */}
      <group position={[0, yOffset, 0]} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        <primitive object={clonedScene} />
      </group>

      {/* Ground Contact Shadow Disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.35, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} />
      </mesh>

      {/* Floating Player Tag */}
      <group position={[0, 1.9, 0]}>
        {/* Glow Ring Indicator */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.88, 0]}>
          <ringGeometry args={[0.42, 0.52, 28]} />
          <meshBasicMaterial
            color={activeChar.accentColor || "#f59e0b"}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/models/characters/Kiss.glb");
