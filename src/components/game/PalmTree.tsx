interface PalmTreeProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

export function PalmTree({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PalmTreeProps) {
  // 6 radial palm fronds
  const frondCount = 7;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Trunk (ដើមត្នោត) */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.12, 2.4, 8]} />
        <meshStandardMaterial color="#574130" roughness={0.9} />
      </mesh>

      {/* Trunk base mound */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.1, 8]} />
        <meshStandardMaterial color="#3f2e22" roughness={0.9} />
      </mesh>

      {/* Palm Crown Top */}
      <group position={[0, 2.4, 0]}>
        {/* Palm fruit cluster (ផ្លែត្នោត) */}
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#713f12" roughness={0.8} />
        </mesh>

        {/* Fan Leaves / Fronds (ស្លឹកត្នោត) */}
        {Array.from({ length: frondCount }).map((_, i) => {
          const angle = (i * Math.PI * 2) / frondCount;
          return (
            <group key={i} rotation={[0.4, angle, 0]}>
              {/* Frond stem */}
              <mesh position={[0, 0.35, 0.4]} rotation={[0.5, 0, 0]} castShadow>
                <boxGeometry args={[0.28, 0.02, 0.9]} />
                <meshStandardMaterial
                  color="#15803d"
                  roughness={0.7}
                  metalness={0.1}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

