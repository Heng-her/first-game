import { RoadModelSingle } from "./RoadModelSingle";
import type { RoadModelItem } from "../../data/roadModels";

interface RoadShowroomGridProps {
  models: RoadModelItem[];
  selectedId: string;
  onSelect: (item: RoadModelItem) => void;
}

export function RoadShowroomGrid({
  models,
  selectedId,
  onSelect,
}: RoadShowroomGridProps) {
  // Compute grid layout: 5 items per row
  const COLS = 5;
  const SPACING = 3.2;

  return (
    <group>
      {models.map((item, index) => {
        const col = index % COLS;
        const row = Math.floor(index / COLS);
        const x = (col - (COLS - 1) / 2) * SPACING;
        const z = (row - Math.floor(models.length / COLS) / 2) * SPACING;
        const isSelected = item.id === selectedId;

        return (
          <group
            key={item.id}
            position={[x, 0, z]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
          >
            {/* Base platform ring for each item */}
            <mesh position={[0, 0.02, 0]} receiveShadow>
              <cylinderGeometry args={[1.3, 1.35, 0.05, 32]} />
              <meshStandardMaterial
                color={isSelected ? "#f59e0b" : "#1e293b"}
                emissive={isSelected ? "#78350f" : "#090d16"}
                metalness={0.4}
                roughness={0.6}
              />
            </mesh>

            {/* Selection indicator pillar when active */}
            {isSelected && (
              <mesh position={[0, 0.01, 0]}>
                <ringGeometry args={[1.4, 1.55, 32]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            )}

            {/* The 3D model */}
            <RoadModelSingle fileName={item.fileName} scale={0.9} />
          </group>
        );
      })}
    </group>
  );
}

