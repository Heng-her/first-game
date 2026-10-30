import { useRef, Suspense, useEffect, useMemo, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { CharacterOption } from "../../types/game";

interface ModelViewerProps {
  character: CharacterOption;
  autoRotate: boolean;
}

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  prevKey?: string;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, prevKey: this.props.resetKey };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: ErrorBoundaryState) {
    if (props.resetKey !== state.prevKey) {
      return { hasError: false, prevKey: props.resetKey };
    }
    return null;
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Stylized Cambodian Adventure Stylized Avatar (Graceful 3D Fallback & Mannequin)
function StylizedMannequin({ character }: { character: CharacterOption }) {
  const accent = character.accentColor || "#f59e0b";

  return (
    <group position={[0, -0.9, 0]}>
      {/* Torso / Body */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.22, 0.42, 16, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Cambodian Krama Scarf (Accent) */}
      <mesh position={[0, 1.42, 0.08]} rotation={[0.1, 0, 0]} castShadow>
        <torusGeometry args={[0.2, 0.06, 16, 32]} />
        <meshStandardMaterial color={accent} roughness={0.7} />
      </mesh>
      {/* Krama Tails */}
      <mesh position={[0.08, 1.2, 0.16]} rotation={[0.15, 0, -0.1]} castShadow>
        <boxGeometry args={[0.09, 0.35, 0.03]} />
        <meshStandardMaterial color={accent} roughness={0.7} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>

      {/* Hair / Headband */}
      <mesh position={[0, 1.78, -0.04]} castShadow>
        <sphereGeometry args={[0.185, 20, 20]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.12, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.72, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[0.12, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.72, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Boots / Shoes */}
      <mesh position={[-0.12, 0.14, 0.04]} castShadow>
        <boxGeometry args={[0.11, 0.14, 0.22]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      <mesh position={[0.12, 0.14, 0.04]} castShadow>
        <boxGeometry args={[0.11, 0.14, 0.22]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.32, 1.22, 0]} rotation={[0, 0, 0.2]} castShadow>
        <capsuleGeometry args={[0.06, 0.38, 12, 12]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>
      <mesh position={[0.32, 1.22, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.06, 0.38, 12, 12]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.6} />
      </mesh>

      {/* Adventure Backpack */}
      <mesh position={[0, 1.26, -0.2]} castShadow>
        <boxGeometry args={[0.32, 0.38, 0.16]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Dedicated GLTF Loader Subcomponent (Unconditional Hook Call + Skeleton Cloning + Auto Normalization)
function LoadedGLTFModel({ character }: { character: CharacterOption }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(character.modelPath);

  // Clone scene safely with SkeletonUtils so animation bindings and materials are preserved cleanly
  const clonedScene = useMemo(() => {
    const clone = cloneSkeleton(gltf.scene);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = THREE.MathUtils.clamp(mat.roughness ?? 0.6, 0.3, 0.9);
          mat.needsUpdate = true;
        }
      }
    });
    return clone;
  }, [gltf.scene]);

  // Bind animations to groupRef
  const { actions } = useAnimations(gltf.animations, groupRef);

  useEffect(() => {
    if (!actions) return;
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0) {
      // Prefer mixamo.com or first available animation
      const activeAnim = actions["mixamo.com"] || actions[actionNames[0]];
      if (activeAnim) {
        activeAnim.reset().fadeIn(0.25).play();
      }
    }
  }, [actions, character.modelPath]);

  // Compute bounding box and automatically normalize scale & Y offset
  // (e.g. Mixamo export in cm height 178cm -> normalized to ~1.75 meters)
  const { scaleFactor, yOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const min = box.min;

    let s = 1.0;
    if (size.y > 10) {
      // Model is in centimeters (e.g. ~178 cm)
      s = 1.75 / size.y;
    } else if (size.y > 0.1) {
      // Model is in meters
      s = 1.75 / size.y;
    }

    // Offset so feet align exactly at top of the stone pedestal (Y = -0.9)
    const offset = -0.9 - min.y * s;
    return { scaleFactor: s, yOffset: offset };
  }, [clonedScene]);

  // Check if GLTF actually has visible renderable meshes
  let hasMeshes = false;
  if (clonedScene) {
    clonedScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        hasMeshes = true;
      }
    });
  }

  if (!hasMeshes) {
    return <StylizedMannequin character={character} />;
  }

  return (
    <group
      ref={groupRef}
      position={[0, yOffset, 0]}
      scale={[scaleFactor, scaleFactor, scaleFactor]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

function CharacterModel({ character }: { character: CharacterOption }) {
  return (
    <ModelErrorBoundary
      resetKey={character.modelPath}
      fallback={<StylizedMannequin character={character} />}
    >
      <Suspense fallback={<StylizedMannequin character={character} />}>
        <LoadedGLTFModel key={character.modelPath} character={character} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

// Dynamic Turntable Rotator
function RotatingPodium({
  character,
  autoRotate,
}: {
  character: CharacterOption;
  autoRotate: boolean;
}) {
  const podiumRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (autoRotate && podiumRef.current) {
      podiumRef.current.rotation.y += delta * 0.7;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.4;
    }
  });

  const accent = character.accentColor || "#f59e0b";

  return (
    <group ref={podiumRef}>
      <CharacterModel character={character} />

      {/* Glowing 3D Pedestal Base */}
      <group position={[0, -0.92, 0]}>
        {/* Main Stone Disk */}
        <mesh receiveShadow position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.95, 1.05, 0.08, 36]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Glowing Accent Border Ring */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.82, 0.92, 40]} />
          <meshBasicMaterial color={accent} transparent opacity={0.8} />
        </mesh>

        {/* Ancient Khmer Lotus Motif Petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <mesh
              key={i}
              position={[Math.cos(rad) * 0.88, 0.02, Math.sin(rad) * 0.88]}
              rotation={[-Math.PI / 2, 0, rad]}
            >
              <coneGeometry args={[0.04, 0.08, 4]} />
              <meshBasicMaterial color={accent} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export function CharacterPreview3D({ character, autoRotate }: ModelViewerProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "radial-gradient(circle at 50% 40%, rgba(30, 58, 102, 0.4) 0%, rgba(2, 6, 23, 0.95) 75%)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.9, 2.7], fov: 42 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Ambient & Key Lights */}
        <ambientLight intensity={1.1} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={2.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* Soft colored Rim Light from behind */}
        <pointLight
          position={[-2, 2.5, -2]}
          intensity={1.5}
          color={character.accentColor || "#38bdf8"}
        />
        <pointLight position={[2, 0.5, 2]} intensity={0.9} color="#fef08a" />

        <Suspense fallback={null}>
          <RotatingPodium character={character} autoRotate={autoRotate} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={1.6}
          maxDistance={4.2}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
    </div>
  );
}

// Preload the updated character model
useGLTF.preload("/models/characters/Kiss.glb");
