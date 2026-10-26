import { useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useModelAvailability } from "../../hooks/useModelAvailability";

const MAP_MODEL_PATH = "/models/map/khmer_adventure_map.glb";
const TUKTUK_MODEL_PATH = "/models/vehicles/tuk-tuk.glb";

// Custom full 3D adventure map (400m x 400m)
function LoadedGLTFMap({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name === "water") {
          // Water does not cast shadow or block player
          mesh.castShadow = false;
          mesh.receiveShadow = true;
          mesh.userData.isGround = false;
          mesh.userData.isCollider = false;
        } else if (mesh.name === "terrain") {
          // Terrain receives shadow and acts as ground elevation collider
          mesh.castShadow = false;
          mesh.receiveShadow = true;
          mesh.userData.isGround = true; // Designated for player ground snapping
          mesh.userData.isCollider = false; // Exclude from expensive horizontal raycasts
        } else if (mesh.name === "props") {
          // Props (Temple complex & River Bridge, only 5.4k faces now)
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData.isGround = true; // Enables walking on temple steps, terraces, and bridge!
          mesh.userData.isCollider = true; // Enables solid wall bumping so player cannot walk through walls!
        } else {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      }
    });
  }, [scene]);

  // Map origin at (0, 0, 0) aligned with true Blender coordinate space
  return <primitive object={scene} position={[0, 0, 0]} />;
}

function ParkedTukTuk({ isCustomMap = true }: { isCustomMap?: boolean }) {
  const isTukTukAvailable = useModelAvailability(TUKTUK_MODEL_PATH);
  if (!isTukTukAvailable) return null;
  return <LoadedTukTukModel url={TUKTUK_MODEL_PATH} isCustomMap={isCustomMap} />;
}

function LoadedTukTukModel({
  url,
  isCustomMap,
}: {
  url: string;
  isCustomMap: boolean;
}) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData.isCollider = true;
      }
    });
  }, [scene]);

  // Elevation at (6.5, 7.5) is ~4.98m on the custom 3D terrain, or 0 on fallback ground
  const yPos = isCustomMap ? 4.98 : 0;

  return (
    <group position={[6.5, yPos, 7.5]} rotation={[0, -Math.PI / 4, 0]}>
      <primitive object={scene} />
      {/* Floating beacon to spot Tuk-Tuk */}
      <mesh position={[0, 2.6, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}

// Procedural environment landscape (Fallback only if custom model is absent)
function EnvironmentLandscape() {
  return (
    <group name="environment-landscape">
      {/* Main Ground / Grass Field */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.85} />
      </mesh>

      {/* Main Stone Exploration Pathway */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[6.5, 90]} />
        <meshStandardMaterial color="#8c7853" roughness={0.9} />
      </mesh>

      {/* Cross Pathway */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[90, 6.5]} />
        <meshStandardMaterial color="#8c7853" roughness={0.9} />
      </mesh>

      {/* River Canal (Tonle Sap Tributary) */}
      <group position={[32, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[16, 140]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.1}
            metalness={0.4}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* River Wooden Bridge */}
        <group position={[-32, 0, 0]}>
          <mesh position={[32, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[17, 0.3, 5]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[32, 0.8, -2.4]} castShadow>
            <boxGeometry args={[17, 0.8, 0.15]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
          <mesh position={[32, 0.8, 2.4]} castShadow>
            <boxGeometry args={[17, 0.8, 0.15]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Tropical Sugar Palm Trees (Thnot) */}
      {[
        [-14, -10],
        [-18, 5],
        [-10, 15],
        [-22, -20],
        [12, -15],
        [15, 12],
        [-8, -25],
        [10, -28],
        [-15, 30],
        [8, 26],
      ].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          <mesh position={[0, 3, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.45, 6, 7]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.9} />
          </mesh>
          <mesh position={[0, 6.2, 0]} castShadow>
            <coneGeometry args={[2.8, 2.5, 6]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
          <mesh position={[0, 7.3, 0]} castShadow>
            <coneGeometry args={[2.1, 2.2, 6]} />
            <meshStandardMaterial color="#16a34a" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Fallback Sanctuary in case custom glb is absent
function FallbackSanctuary() {
  return (
    <group position={[0, 0, -18]}>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 3, 14]} />
        <meshStandardMaterial color="#6b5b45" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function WorldMap() {
  const isCustomModelAvailable = useModelAvailability(MAP_MODEL_PATH);

  // If custom map is available, render ONLY the custom map to avoid duplicate world clipping
  if (isCustomModelAvailable) {
    return (
      <group name="world-map">
        <LoadedGLTFMap url={MAP_MODEL_PATH} />
        <ParkedTukTuk isCustomMap={true} />
      </group>
    );
  }

  // Fallback environment only when custom GLB is missing
  return (
    <group name="world-map">
      <EnvironmentLandscape />
      <FallbackSanctuary />
      <ParkedTukTuk isCustomMap={false} />
    </group>
  );
}
