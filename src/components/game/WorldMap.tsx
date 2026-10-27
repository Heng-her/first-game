import { useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useModelAvailability } from "../../hooks/useModelAvailability";

const MAP_MODEL_PATH = "/models/map/khmer_adventure_map.glb";
const TUKTUK_MODEL_PATH = "/models/vehicles/tuk-tuk.glb";

// Custom full 3D adventure map
function LoadedGLTFMap({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name === "water") {
          mesh.castShadow = false;
          mesh.receiveShadow = true;
          mesh.userData.isGround = false;
          mesh.userData.isCollider = false;
        } else if (mesh.name === "terrain") {
          mesh.castShadow = false;
          mesh.receiveShadow = true;
          mesh.userData.isGround = true;
          mesh.userData.isCollider = false;
        } else if (mesh.name === "props") {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData.isGround = true;
          mesh.userData.isCollider = true;
        } else {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      }
    });
  }, [scene]);

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
      }
    });
  }, [scene]);

  const yPos = isCustomMap ? 4.98 : 0;

  return (
    <group position={[6.5, yPos, 7.5]} rotation={[0, -Math.PI / 4, 0]}>
      <primitive object={scene} />
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

// Single Prasat Lotus Tower component
function PrasatTower({
  position,
  height = 8,
  baseWidth = 3.5,
  isMain = false,
}: {
  position: [number, number, number];
  height?: number;
  baseWidth?: number;
  isMain?: boolean;
}) {
  return (
    <group position={position}>
      {/* Tower Base Plinth */}
      <mesh position={[0, height * 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseWidth, height * 0.5, baseWidth]} />
        <meshStandardMaterial color="#82725e" roughness={0.88} />
      </mesh>

      {/* Tiered Sandstone Mid Section */}
      <mesh position={[0, height * 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseWidth * 0.82, height * 0.25, baseWidth * 0.82]} />
        <meshStandardMaterial color="#736350" roughness={0.85} />
      </mesh>

      {/* Tier 3 Mid Section */}
      <mesh position={[0, height * 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseWidth * 0.65, height * 0.2, baseWidth * 0.65]} />
        <meshStandardMaterial color="#655543" roughness={0.85} />
      </mesh>

      {/* Lotus Bud Curved Spire (Prasat Top) */}
      <mesh position={[0, height + 1.2, 0]} castShadow>
        <coneGeometry args={[baseWidth * 0.42, 2.8, 8]} />
        <meshStandardMaterial color="#8c7a65" roughness={0.8} />
      </mesh>

      {/* Golden Lotus Pinnacle for the central tower */}
      {isMain && (
        <mesh position={[0, height + 2.8, 0]} castShadow>
          <octahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      )}
    </group>
  );
}

// Authentic Angkor Wat Multi-Tiered Sandstone Sanctuary
function AngkorSanctuary() {
  return (
    <group position={[0, 0, -18]} name="angkor-sanctuary">
      {/* Ground Foundation Terrace (Lower Plinth) */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[26, 1.5, 26]} />
        <meshStandardMaterial color="#5e4f40" roughness={0.9} />
      </mesh>

      {/* Upper Stone Terrace (Cruciform Plinth) */}
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[18, 1.4, 18]} />
        <meshStandardMaterial color="#7a6956" roughness={0.88} />
      </mesh>

      {/* Stone Steps Leading Up to Sanctuary (South Front) */}
      {[0, 1, 2, 3].map((step) => (
        <mesh key={step} position={[0, 0.35 * (step + 1), 9 + (4 - step) * 0.6]} castShadow receiveShadow>
          <boxGeometry args={[5, 0.35, 0.8]} />
          <meshStandardMaterial color="#8a7966" roughness={0.85} />
        </mesh>
      ))}

      {/* Grand Central Lotus Tower (Prasat Thom) */}
      <PrasatTower position={[0, 2.9, 0]} height={10} baseWidth={5.2} isMain={true} />

      {/* 4 Corner Lotus Towers (Prasat Chroung) */}
      <PrasatTower position={[-6.2, 2.9, -6.2]} height={6.8} baseWidth={3.4} />
      <PrasatTower position={[6.2, 2.9, -6.2]} height={6.8} baseWidth={3.4} />
      <PrasatTower position={[-6.2, 2.9, 6.2]} height={6.8} baseWidth={3.4} />
      <PrasatTower position={[6.2, 2.9, 6.2]} height={6.8} baseWidth={3.4} />

      {/* Entrance Portico / Mandapa with Sandstone Pillars */}
      {[-2.2, -0.7, 0.7, 2.2].map((x, i) => (
        <mesh key={i} position={[x, 4.2, 7.8]} castShadow>
          <cylinderGeometry args={[0.22, 0.26, 2.6, 8]} />
          <meshStandardMaterial color="#94826d" roughness={0.85} />
        </mesh>
      ))}

      {/* Portico Gable Roof */}
      <mesh position={[0, 5.7, 7.8]} castShadow>
        <boxGeometry args={[6.2, 0.45, 2.2]} />
        <meshStandardMaterial color="#6e5d4c" roughness={0.9} />
      </mesh>

      {/* Inner Sacred Golden Light */}
      <pointLight position={[0, 4.5, 0]} color="#f59e0b" intensity={3.5} distance={12} />
    </group>
  );
}

// Procedural environment landscape
function EnvironmentLandscape() {
  return (
    <group name="environment-landscape">
      {/* Main Ground / Lush Tropical Grass Field */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#2d5e23" roughness={0.85} />
      </mesh>

      {/* Main Ancient Laterite Stone Exploration Pathway */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[7, 100]} />
        <meshStandardMaterial color="#9c835f" roughness={0.88} />
      </mesh>

      {/* Cross Pathway */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 7]} />
        <meshStandardMaterial color="#9c835f" roughness={0.88} />
      </mesh>

      {/* Ancient Boundary Stone Markers (Sema Stones) along the main path */}
      {[-3.6, 3.6].map((x, side) =>
        [-25, -15, -5, 5, 15, 25].map((z, idx) => (
          <group key={`${side}-${idx}`} position={[x, 0, z]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.9, 6]} />
              <meshStandardMaterial color="#7c6c59" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.95, 0]} castShadow>
              <coneGeometry args={[0.2, 0.35, 6]} />
              <meshStandardMaterial color="#6a5a49" roughness={0.85} />
            </mesh>
          </group>
        ))
      )}

      {/* River Canal (Siem Reap River Tributary) with Reflective Water */}
      <group position={[32, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[18, 160]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.08}
            metalness={0.65}
            transparent
            opacity={0.88}
          />
        </mesh>
        {/* River Wooden and Stone Bridge */}
        <group position={[-32, 0, 0]}>
          <mesh position={[32, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[19, 0.35, 5.5]} />
            <meshStandardMaterial color="#78350f" roughness={0.82} />
          </mesh>
          <mesh position={[32, 0.85, -2.5]} castShadow>
            <boxGeometry args={[19, 0.75, 0.18]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
          <mesh position={[32, 0.85, 2.5]} castShadow>
            <boxGeometry args={[19, 0.75, 0.18]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Tropical Sugar Palm Trees (ដើមត្នោតខ្មែរ) */}
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
        [-25, -5],
        [-28, 18],
      ].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          <mesh position={[0, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.48, 6.4, 8]} />
            <meshStandardMaterial color="#543319" roughness={0.92} />
          </mesh>
          {/* Palm Fronds Foliage */}
          <mesh position={[0, 6.6, 0]} castShadow>
            <coneGeometry args={[2.9, 2.6, 7]} />
            <meshStandardMaterial color="#15803d" roughness={0.75} />
          </mesh>
          <mesh position={[0, 7.8, 0]} castShadow>
            <coneGeometry args={[2.2, 2.3, 7]} />
            <meshStandardMaterial color="#16a34a" roughness={0.75} />
          </mesh>
          {/* Sugar Palm Fruit cluster */}
          <mesh position={[0, 6.0, 0]}>
            <sphereGeometry args={[0.45, 6, 6]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function WorldMap() {
  const isCustomModelAvailable = useModelAvailability(MAP_MODEL_PATH);

  if (isCustomModelAvailable) {
    return (
      <group name="world-map">
        <LoadedGLTFMap url={MAP_MODEL_PATH} />
        <ParkedTukTuk isCustomMap={true} />
      </group>
    );
  }

  return (
    <group name="world-map">
      <EnvironmentLandscape />
      <AngkorSanctuary />
      <ParkedTukTuk isCustomMap={false} />
    </group>
  );
}
