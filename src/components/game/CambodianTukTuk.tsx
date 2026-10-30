import { useRef } from "react";
import type { Group } from "three";

interface TukTukProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isNight?: boolean;
}

export function CambodianTukTuk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 0.5,
  isNight = false,
}: TukTukProps) {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* 1. FRONT MOTORCYCLE (ម៉ូតូខាងមុខ) */}
      <group position={[0, 0, 0.8]}>
        {/* Front Wheel */}
        <mesh position={[0, 0.22, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 20]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        {/* Front Rim */}
        <mesh position={[0, 0.22, 0.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.082, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Fork & Stem */}
        <mesh position={[0, 0.35, 0.35]} rotation={[Math.PI / 6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.45, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Handlebars */}
        <mesh position={[0, 0.55, 0.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Headlight */}
        <mesh position={[0, 0.45, 0.45]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.08, 16]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Headlight Lens (Glow at night) */}
        <mesh position={[0, 0.47, 0.49]}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color={isNight ? "#fef08a" : "#fffbeb"} />
        </mesh>
        {isNight && (
          <spotLight
            position={[0, 0.47, 0.5]}
            target-position={[0, 0, 4]}
            angle={0.5}
            penumbra={0.5}
            intensity={3}
            color="#fef08a"
            distance={8}
          />
        )}

        {/* Motorcycle Body / Gas Tank */}
        <mesh position={[0, 0.36, 0.05]} castShadow>
          <boxGeometry args={[0.2, 0.18, 0.45]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.4} roughness={0.4} />
        </mesh>

        {/* Driver Seat */}
        <mesh position={[0, 0.38, -0.18]} castShadow>
          <boxGeometry args={[0.22, 0.08, 0.25]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      </group>

      {/* 2. TOW HITCH & FRAME (គន្លឹះតភ្ជាប់រ៉ឺម៉ក) */}
      <mesh position={[0, 0.24, 0.45]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>

      {/* 3. REAR CARRIAGE (រ៉ឺម៉កអ្នកដំណើរ) */}
      <group position={[0, 0, -0.2]}>
        {/* Carriage Floor Chassis */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.75, 0.06, 0.95]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
        </mesh>

        {/* Left Rear Wheel */}
        <mesh position={[-0.42, 0.2, -0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.07, 20]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        {/* Right Rear Wheel */}
        <mesh position={[0.42, 0.2, -0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.07, 20]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* Passenger Bench Cushion (ពូកអង្គុយ) */}
        <mesh position={[0, 0.3, -0.3]} castShadow>
          <boxGeometry args={[0.68, 0.14, 0.26]} />
          <meshStandardMaterial color="#854d0e" roughness={0.7} />
        </mesh>
        {/* Passenger Backrest */}
        <mesh position={[0, 0.46, -0.42]} castShadow>
          <boxGeometry args={[0.68, 0.22, 0.06]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>

        {/* Canopy Metal Support Poles (បង្គោលទ្រដំបូល ៤) */}
        {[
          [-0.34, -0.42],
          [0.34, -0.42],
          [-0.34, 0.42],
          [0.34, 0.42],
        ].map(([px, pz], idx) => (
          <mesh key={idx} position={[px, 0.48, pz]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.52, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}

        {/* Decorative Canopy Roof (ដំបូលរ៉ឺម៉កកោងស្អាត) */}
        <mesh position={[0, 0.74, 0]} castShadow>
          <boxGeometry args={[0.82, 0.04, 1.05]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Canopy Curved Cap */}
        <mesh position={[0, 0.78, 0]} castShadow>
          <boxGeometry args={[0.76, 0.04, 0.98]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>

        {/* Cambodian Flag / Golden Trim Accent on roof */}
        <mesh position={[0, 0.81, 0]}>
          <boxGeometry args={[0.4, 0.02, 0.6]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

