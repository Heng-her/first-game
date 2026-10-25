import { useGLTF } from '@react-three/drei';
import { useModelAvailability } from '../../hooks/useModelAvailability';

const MAP_MODEL_PATH = '/models/map/angkor-world.glb';

function LoadedGLTFMap({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={[0, 0, 0]} />;
}

// Procedural stylized fallback map: Angkor Temple Courtyard & Jungle Oasis
function FallbackAngkorWorld() {
  return (
    <group name="fallback-angkor-world">
      {/* Main Ground / Grass Field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </mesh>

      {/* Stone Exploration Pathway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 80]} />
        <meshStandardMaterial color="#8c7853" roughness={0.9} />
      </mesh>

      {/* Cross Pathway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 6]} />
        <meshStandardMaterial color="#8c7853" roughness={0.9} />
      </mesh>

      {/* Ancient Temple Courtyard Platform (Plinth) */}
      <group position={[0, 0, -18]}>
        {/* Tier 1 Base */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[16, 0.8, 16]} />
          <meshStandardMaterial color="#6b5b45" roughness={0.9} />
        </mesh>

        {/* Tier 2 Terrace */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 0.6, 12]} />
          <meshStandardMaterial color="#5a4d3a" roughness={0.9} />
        </mesh>

        {/* Central Shrine / Prasat Tower */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 4.2, 6]} />
          <meshStandardMaterial color="#4a3f30" roughness={0.9} />
        </mesh>
        
        {/* Tower Top Spire */}
        <mesh position={[0, 6.5, 0]} castShadow>
          <coneGeometry args={[2.5, 3, 4]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} metalness={0.2} />
        </mesh>

        {/* 4 Corner Ancient Pillars */}
        {[
          [-6.5, -6.5],
          [6.5, -6.5],
          [-6.5, 6.5],
          [6.5, 6.5],
        ].map(([px, pz], idx) => (
          <group key={idx} position={[px, 1.4, pz]}>
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.4, 0.45, 3, 8]} />
              <meshStandardMaterial color="#554937" roughness={0.9} />
            </mesh>
            <mesh position={[0, 3.1, 0]} castShadow>
              <boxGeometry args={[1.1, 0.3, 1.1]} />
              <meshStandardMaterial color="#443a2c" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Ancient Stone Lanterns with Warm Light */}
        {[-3.5, 3.5].map((lx, idx) => (
          <group key={idx} position={[lx, 1.5, 7]}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.3, 1, 6]} />
              <meshStandardMaterial color="#3b3226" />
            </mesh>
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.5} />
            </mesh>
            <pointLight position={[0, 1.2, 0]} color="#f59e0b" intensity={3} distance={10} />
          </group>
        ))}
      </group>

      {/* River Canal (Tonle Sap Tributary) */}
      <group position={[28, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[14, 120]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.1}
            metalness={0.4}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* River Wooden Bridge */}
        <group position={[-28, 0, 0]}>
          <mesh position={[28, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[15, 0.3, 4.5]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[28, 0.8, -2.1]} castShadow>
            <boxGeometry args={[15, 0.8, 0.15]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
          <mesh position={[28, 0.8, 2.1]} castShadow>
            <boxGeometry args={[15, 0.8, 0.15]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Tropical Palm & Sugar Palm Trees (Thnot) */}
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
          {/* Trunk */}
          <mesh position={[0, 3, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.45, 6, 7]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.9} />
          </mesh>
          {/* Leaves */}
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

      {/* Decorative Ancient Boulders */}
      {[
        [-6, 0.6, -6, 1.2],
        [7, 0.5, -8, 1.0],
        [-12, 0.8, 8, 1.5],
        [14, 0.6, -5, 1.1],
        [8, 0.7, 18, 1.3],
      ].map(([rx, ry, rz, scale], idx) => (
        <mesh key={idx} position={[rx, ry, rz]} scale={scale} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#71717a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function WorldMap() {
  const isCustomModelAvailable = useModelAvailability(MAP_MODEL_PATH);

  if (isCustomModelAvailable) {
    return <LoadedGLTFMap url={MAP_MODEL_PATH} />;
  }

  return <FallbackAngkorWorld />;
}
