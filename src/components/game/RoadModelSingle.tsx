import { useMemo } from "react";
import { useGLTF, Center } from "@react-three/drei";

interface RoadModelSingleProps {
  fileName: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export function RoadModelSingle({
  fileName,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
}: RoadModelSingleProps) {
  const modelUrl = `/kenney_city-kit-roads/Models/GLB format/${fileName}`;
  const { scene } = useGLTF(modelUrl);

  // Clone scene so multiple instances don't share conflicting transforms
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      // @ts-expect-error Three.js mesh type traversal
      if (child.isMesh) {
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
      }
    });
    return clone;
  }, [scene, castShadow, receiveShadow]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Center top>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

