import { useMemo, type RefObject } from "react";
import { useGLTF } from "@react-three/drei";
import { CambodianTukTuk } from "./CambodianTukTuk";
import { PalmTree } from "./PalmTree";
import { PlayableSoldier } from "./PlayableSoldier";
import type { SoldierState, VirtualInput } from "../../data/soldierConfig";

// Unique model names for preloading
const CITY_MODELS = [
  "road-roundabout.glb",
  "road-straight.glb",
  "road-bend.glb",
  "road-crossroad.glb",
  "road-crossing.glb",
  "road-bridge.glb",
  "bridge-pillar.glb",
  "light-curved.glb",
  "traffic-light.glb",
  "electricity-pole.glb",
  "road-sign-stop.glb",
  "road-sign-street.glb",
  "road-sign-warning.glb",
  "sign-highway.glb",
  "construction-cone.glb",
  "construction-barrier.glb",
  "construction-light.glb",
  "dumpster.glb",
];

// Preload all models
CITY_MODELS.forEach((name) => {
  useGLTF.preload(`/kenney_city-kit-roads/Models/GLB format/${name}`);
});

interface TileDef {
  file: string;
  pos: [number, number, number];
  rot?: number; // Y rotation in radians
}

function PlacedTile({ file, pos, rot = 0 }: TileDef) {
  const { scene } = useGLTF(`/kenney_city-kit-roads/Models/GLB format/${file}`);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} position={pos} rotation={[0, rot, 0]} />;
}

interface CityTrackSceneProps {
  isNight?: boolean;
  soldierStateRef: RefObject<SoldierState>;
  onKeyChange?: (keys: { w: boolean; a: boolean; s: boolean; d: boolean; shift: boolean }) => void;
  virtualInputRef?: RefObject<VirtualInput>;
}

export function CityTrackScene({
  isNight = false,
  soldierStateRef,
  onKeyChange,
  virtualInputRef,
}: CityTrackSceneProps) {
  // =========================================================================
  // ROAD NETWORK DEFINITIONS (5X LARGER SPRAWLING CITY MAP ~50x50 UNITS)
  // =========================================================================
  const tiles: TileDef[] = useMemo(() => {
    const list: TileDef[] = [];
    const H_PI = Math.PI / 2;

    // Helper: add horizontal straight road (runs along X)
    const addHStraight = (x1: number, x2: number, z: number) => {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      for (let x = minX; x <= maxX; x++) {
        list.push({ file: "road-straight.glb", pos: [x, 0, z], rot: 0 });
      }
    };

    // Helper: add vertical straight road (runs along Z)
    const addVStraight = (x: number, z1: number, z2: number) => {
      const minZ = Math.min(z1, z2);
      const maxZ = Math.max(z1, z2);
      for (let z = minZ; z <= maxZ; z++) {
        list.push({ file: "road-straight.glb", pos: [x, 0, z], rot: H_PI });
      }
    };

    // -----------------------------------------------------------------------
    // 1. CENTRAL PLAZA (Roundabout + 4 Main Arteries)
    // -----------------------------------------------------------------------
    // Central Roundabout (3x3 at [0, 0, 0])
    list.push({ file: "road-roundabout.glb", pos: [0, 0, 0] });

    // Pedestrian crossings at exits of Roundabout
    list.push({ file: "road-crossing.glb", pos: [2, 0, 0], rot: 0 });
    list.push({ file: "road-crossing.glb", pos: [-2, 0, 0], rot: 0 });
    list.push({ file: "road-crossing.glb", pos: [0, 0, 2], rot: H_PI });
    list.push({ file: "road-crossing.glb", pos: [0, 0, -2], rot: H_PI });

    // Inner avenues from Roundabout to major crossroads:
    addHStraight(3, 5, 0); // East towards crossroad (6, 0)
    addHStraight(-5, -3, 0); // West towards crossroad (-6, 0)
    addVStraight(0, 3, 5); // South towards crossroad (0, 6)
    addVStraight(0, -5, -3); // North towards crossroad (0, -6)

    // Inner 4 major crossroads
    list.push({ file: "road-crossroad.glb", pos: [6, 0, 0] });
    list.push({ file: "road-crossroad.glb", pos: [-6, 0, 0] });
    list.push({ file: "road-crossroad.glb", pos: [0, 0, 6] });
    list.push({ file: "road-crossroad.glb", pos: [0, 0, -6] });

    // Inner quadrant connectors (Loop around roundabout):
    addVStraight(6, -5, -1);
    addVStraight(6, 1, 5);
    addVStraight(-6, -5, -1);
    addVStraight(-6, 1, 5);
    addHStraight(1, 5, -6);
    addHStraight(-5, -1, -6);
    addHStraight(1, 5, 6);
    addHStraight(-5, -1, 6);

    // Inner quadrant 4 corners
    list.push({ file: "road-crossroad.glb", pos: [6, 0, -6] });
    list.push({ file: "road-crossroad.glb", pos: [-6, 0, -6] });
    list.push({ file: "road-crossroad.glb", pos: [6, 0, 6] });
    list.push({ file: "road-crossroad.glb", pos: [-6, 0, 6] });

    // -----------------------------------------------------------------------
    // 2. SCENIC RIVER CANAL & 3 ELEVATED BRIDGES (At x = 10, z from -22 to +22)
    // -----------------------------------------------------------------------
    // Bridge 1 (Central East Approach from [6, 0] to [10, 0]):
    addHStraight(7, 9, 0);
    list.push({ file: "road-bridge.glb", pos: [10, 0, 0] });
    list.push({ file: "bridge-pillar.glb", pos: [10, 0, 0] });
    addHStraight(11, 13, 0);
    list.push({ file: "road-crossroad.glb", pos: [14, 0, 0] });

    // Bridge 2 (Northern River Crossing at z = -14):
    addHStraight(7, 9, -14);
    list.push({ file: "road-bridge.glb", pos: [10, 0, -14] });
    list.push({ file: "bridge-pillar.glb", pos: [10, 0, -14] });
    addHStraight(11, 13, -14);
    list.push({ file: "road-crossroad.glb", pos: [14, 0, -14] });

    // Bridge 3 (Southern River Crossing at z = +14):
    addHStraight(7, 9, 14);
    list.push({ file: "road-bridge.glb", pos: [10, 0, 14] });
    list.push({ file: "bridge-pillar.glb", pos: [10, 0, 14] });
    addHStraight(11, 13, 14);
    list.push({ file: "road-crossroad.glb", pos: [14, 0, 14] });

    // Riverbank Avenue (West side of river, along x = 6):
    addVStraight(6, -13, -7);
    list.push({ file: "road-crossroad.glb", pos: [6, 0, -14] });
    addVStraight(6, -21, -15);
    addVStraight(6, 7, 13);
    list.push({ file: "road-crossroad.glb", pos: [6, 0, 14] });
    addVStraight(6, 15, 21);

    // -----------------------------------------------------------------------
    // 3. EASTERN HIGHWAY & COUNTRYSIDE SCENIC LOOP (x = 14 to 22, z = -22 to 22)
    // -----------------------------------------------------------------------
    // Eastern Highway along x = 14 (connecting all 3 bridges):
    addVStraight(14, -13, -1);
    addVStraight(14, 1, 13);
    addVStraight(14, -21, -15);
    addVStraight(14, 15, 21);

    // Far East Countryside Outer Highway along x = 22:
    addHStraight(15, 21, -14);
    addHStraight(15, 21, 14);
    addHStraight(15, 21, 0);
    list.push({ file: "road-crossroad.glb", pos: [22, 0, 0] });

    // East highway turns
    list.push({ file: "road-bend.glb", pos: [22, 0, -14], rot: 0 }); // Turn South
    addVStraight(22, -13, -1);
    addVStraight(22, 1, 13);
    list.push({ file: "road-bend.glb", pos: [22, 0, 14], rot: -H_PI }); // Turn West

    // -----------------------------------------------------------------------
    // 4. WESTERN OLD MARKET & HERITAGE DISTRICT (x = -6 to -22, z = -14 to 14)
    // -----------------------------------------------------------------------
    // Main West Commercial Avenue from (-6, 0) to (-20, 0):
    addHStraight(-11, -7, 0);
    list.push({ file: "road-crossroad.glb", pos: [-12, 0, 0] });
    addHStraight(-17, -13, 0);
    list.push({ file: "road-crossroad.glb", pos: [-18, 0, 0] });
    addHStraight(-21, -19, 0);
    list.push({ file: "road-bend.glb", pos: [-22, 0, 0], rot: H_PI }); // turn north/south

    // Northern Market Grid Avenue (at z = -7):
    addHStraight(-11, -7, -7);
    list.push({ file: "road-crossroad.glb", pos: [-12, 0, -7] });
    addHStraight(-17, -13, -7);
    list.push({ file: "road-crossroad.glb", pos: [-18, 0, -7] });
    addHStraight(-21, -19, -7);

    // Southern Market Grid Avenue (at z = +7):
    addHStraight(-11, -7, 7);
    list.push({ file: "road-crossroad.glb", pos: [-12, 0, 7] });
    addHStraight(-17, -13, 7);
    list.push({ file: "road-crossroad.glb", pos: [-18, 0, 7] });
    addHStraight(-21, -19, 7);

    // North-South connecting streets in Old Market (at x = -12 and x = -18):
    addVStraight(-12, -6, -1);
    addVStraight(-12, 1, 6);
    addVStraight(-12, -13, -8);
    addVStraight(-12, 8, 13);
    list.push({ file: "road-crossroad.glb", pos: [-12, 0, -14] });
    list.push({ file: "road-crossroad.glb", pos: [-12, 0, 14] });

    addVStraight(-18, -6, -1);
    addVStraight(-18, 1, 6);
    addVStraight(-18, -13, -8);
    addVStraight(-18, 8, 13);
    list.push({ file: "road-crossroad.glb", pos: [-18, 0, -14] });
    list.push({ file: "road-crossroad.glb", pos: [-18, 0, 14] });

    // West Avenue at x = -6 continuing North and South:
    addVStraight(-6, -13, -7);
    list.push({ file: "road-crossroad.glb", pos: [-6, 0, -14] });
    addVStraight(-6, -21, -15);
    addVStraight(-6, 7, 13);
    list.push({ file: "road-crossroad.glb", pos: [-6, 0, 14] });
    addVStraight(-6, 15, 21);

    // -----------------------------------------------------------------------
    // 5. NORTH & SOUTH ARTERIAL RING ROADS (At z = -14, -22 and z = 14, 22)
    // -----------------------------------------------------------------------
    // North Arterial Road (z = -14) connecting West to East:
    addHStraight(-5, -1, -14);
    list.push({ file: "road-crossroad.glb", pos: [0, 0, -14] });
    addHStraight(1, 5, -14);
    addHStraight(-11, -7, -14);
    addHStraight(-17, -13, -14);
    list.push({ file: "road-bend.glb", pos: [-22, 0, -14], rot: H_PI }); // West terminus
    addHStraight(-21, -19, -14);

    // South Arterial Road (z = +14) connecting West to East:
    addHStraight(-5, -1, 14);
    list.push({ file: "road-crossroad.glb", pos: [0, 0, 14] });
    addHStraight(1, 5, 14);
    addHStraight(-11, -7, 14);
    addHStraight(-17, -13, 14);
    list.push({ file: "road-bend.glb", pos: [-22, 0, 14], rot: Math.PI }); // West terminus
    addHStraight(-21, -19, 14);

    // Central North-South Avenue along x = 0 (Extending all the way from z = -22 to +22):
    addVStraight(0, -13, -7);
    addVStraight(0, -21, -15);
    list.push({ file: "road-bend.glb", pos: [0, 0, -22], rot: H_PI });

    addVStraight(0, 7, 13);
    addVStraight(0, 15, 21);
    list.push({ file: "road-bend.glb", pos: [0, 0, 22], rot: 0 });

    // Far Outer North Ring Road (at z = -22):
    addHStraight(1, 5, -22);
    list.push({ file: "road-bend.glb", pos: [6, 0, -22], rot: 0 });
    addHStraight(-5, -1, -22);
    list.push({ file: "road-bend.glb", pos: [-6, 0, -22], rot: H_PI });

    // Far Outer South Ring Road (at z = +22):
    addHStraight(1, 5, 22);
    list.push({ file: "road-bend.glb", pos: [6, 0, 22], rot: -H_PI });
    addHStraight(-5, -1, 22);
    list.push({ file: "road-bend.glb", pos: [-6, 0, 22], rot: Math.PI });

    return list;
  }, []);

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. EXPANDED ROADS NETWORK (300+ TILES)                       */}
      {/* ============================================================ */}
      {tiles.map((t, idx) => (
        <PlacedTile key={`${t.pos[0]}_${t.pos[2]}_${idx}`} file={t.file} pos={t.pos} rot={t.rot} />
      ))}

      {/* ============================================================ */}
      {/* 2. CENTRAL ANGKOR STUPA MONUMENT PLAZA (ស្តូបកណ្តាលក្រុង)    */}
      {/* ============================================================ */}
      <group position={[0, 0.05, 0]}>
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[0.95, 1.0, 0.1, 32]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.8, 0.35, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.58, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.6, 0.3, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.98, 0]} castShadow>
          <coneGeometry args={[0.3, 0.7, 16]} />
          <meshStandardMaterial color="#fef08a" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.38, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color={isNight ? "#fbbf24" : "#ffffff"} />
        </mesh>
        {isNight && (
          <pointLight position={[0, 1.5, 0]} color="#fbbf24" intensity={2.5} distance={10} />
        )}
      </group>

      {/* ============================================================ */}
      {/* 3. EXTENDED RIVER CANAL (ស្ទឹងសៀមរាប - ប្រវែង 50 ម៉ែត្រ)     */}
      {/* ============================================================ */}
      <group position={[10, -0.25, 0]}>
        {/* River Water Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.2, 52]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.12}
            metalness={0.85}
            transparent
            opacity={0.88}
          />
        </mesh>
        {/* River Bed */}
        <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.6, 52]} />
          <meshStandardMaterial color="#0c2330" roughness={0.9} />
        </mesh>
        {/* Stone Canal Embankments */}
        <mesh position={[-1.2, 0.12, 0]} receiveShadow>
          <boxGeometry args={[0.25, 0.35, 52]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
        <mesh position={[1.2, 0.12, 0]} receiveShadow>
          <boxGeometry args={[0.25, 0.35, 52]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 4. STATIC CAMBODIAN TUK-TUK AT TOURISM STATION (ចំណតកង់បី)   */}
      {/* ============================================================ */}
      {/* Parked safely at the designated curb station near Roundabout */}
      <group position={[1.85, 0.02, 1.85]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Tourism Stop Boarding Platform */}
        <mesh position={[0.4, 0.02, 0]} receiveShadow>
          <boxGeometry args={[0.8, 0.05, 1.6]} />
          <meshStandardMaterial color="#fdf6e2" roughness={0.7} />
        </mesh>
        {/* Wooden Tourism Station Sign */}
        <mesh position={[0.6, 0.6, 0.6]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0.6, 1.1, 0.6]} castShadow>
          <boxGeometry args={[0.04, 0.25, 0.6]} />
          <meshStandardMaterial color="#9a6523" roughness={0.6} />
        </mesh>

        {/* The Parked Cambodian Tuk-Tuk */}
        <CambodianTukTuk isNight={isNight} scale={0.6} />
      </group>

      {/* Second parked Tuk-Tuk at Old Market Stand */}
      <group position={[-12.5, 0.02, -1.8]} rotation={[0, Math.PI / 2, 0]}>
        <CambodianTukTuk isNight={isNight} scale={0.55} />
      </group>

      {/* Playable Soldier 3D Character (Soldier.glb with WASD Movement & Animations) */}
      <PlayableSoldier
        soldierStateRef={soldierStateRef}
        onKeyChange={onKeyChange}
        virtualInputRef={virtualInputRef}
      />

      {/* ============================================================ */}
      {/* 5. STREET LIGHTS, TRAFFIC SIGNALS & HIGHWAY SIGNS            */}
      {/* ============================================================ */}
      {/* Central Roundabout Lamps */}
      <PlacedTile file="light-curved.glb" pos={[1.8, 0, 1.8]} rot={-Math.PI / 4} />
      <PlacedTile file="light-curved.glb" pos={[-1.8, 0, 1.8]} rot={Math.PI / 4} />
      <PlacedTile file="light-curved.glb" pos={[1.8, 0, -1.8]} rot={-Math.PI * 0.75} />
      <PlacedTile file="light-curved.glb" pos={[-1.8, 0, -1.8]} rot={Math.PI * 0.75} />

      {/* Bridge Approach Lamps */}
      <PlacedTile file="light-curved.glb" pos={[8.5, 0, 0.6]} rot={0} />
      <PlacedTile file="light-curved.glb" pos={[11.5, 0, 0.6]} rot={0} />
      <PlacedTile file="light-curved.glb" pos={[8.5, 0, -13.4]} rot={0} />
      <PlacedTile file="light-curved.glb" pos={[11.5, 0, -13.4]} rot={0} />
      <PlacedTile file="light-curved.glb" pos={[8.5, 0, 14.6]} rot={0} />
      <PlacedTile file="light-curved.glb" pos={[11.5, 0, 14.6]} rot={0} />

      {/* Major Crossroads Traffic Lights */}
      <PlacedTile file="traffic-light.glb" pos={[6.6, 0, 0.6]} rot={Math.PI} />
      <PlacedTile file="traffic-light.glb" pos={[5.4, 0, -0.6]} rot={0} />
      <PlacedTile file="traffic-light.glb" pos={[-5.4, 0, 0.6]} rot={Math.PI} />
      <PlacedTile file="traffic-light.glb" pos={[-6.6, 0, -0.6]} rot={0} />
      <PlacedTile file="traffic-light.glb" pos={[0.6, 0, 6.6]} rot={-Math.PI / 2} />
      <PlacedTile file="traffic-light.glb" pos={[-0.6, 0, -6.6]} rot={Math.PI / 2} />
      <PlacedTile file="traffic-light.glb" pos={[14.6, 0, 0.6]} rot={Math.PI} />
      <PlacedTile file="traffic-light.glb" pos={[-12.6, 0, 0.6]} rot={Math.PI} />

      {/* Highway Signs */}
      <PlacedTile file="sign-highway.glb" pos={[16, 0, 0.7]} rot={0} />
      <PlacedTile file="sign-highway.glb" pos={[16, 0, -13.3]} rot={0} />
      <PlacedTile file="sign-highway.glb" pos={[16, 0, 14.7]} rot={0} />

      {/* Road Traffic Signs */}
      <PlacedTile file="road-sign-stop.glb" pos={[2.6, 0, 0.6]} rot={-Math.PI / 2} />
      <PlacedTile file="road-sign-warning.glb" pos={[-2.4, 0, 0.6]} rot={-Math.PI / 2} />
      <PlacedTile file="road-sign-street.glb" pos={[6.6, 0, -0.6]} rot={0} />
      <PlacedTile file="road-sign-street.glb" pos={[-11.4, 0, -0.6]} rot={0} />

      {/* Cambodian Electricity Poles along avenues */}
      <PlacedTile file="electricity-pole.glb" pos={[-0.6, 0, 3.5]} />
      <PlacedTile file="electricity-pole.glb" pos={[-0.6, 0, 9.5]} />
      <PlacedTile file="electricity-pole.glb" pos={[-0.6, 0, -3.5]} />
      <PlacedTile file="electricity-pole.glb" pos={[-0.6, 0, -9.5]} />
      <PlacedTile file="electricity-pole.glb" pos={[-8.5, 0, 0.6]} rot={Math.PI / 2} />
      <PlacedTile file="electricity-pole.glb" pos={[-14.5, 0, 0.6]} rot={Math.PI / 2} />

      {/* Construction Zone in Old Market district */}
      <PlacedTile file="construction-cone.glb" pos={[-14.8, 0, 0.25]} />
      <PlacedTile file="construction-cone.glb" pos={[-15.6, 0, 0.25]} />
      <PlacedTile file="construction-barrier.glb" pos={[-15.2, 0, 0.25]} />
      <PlacedTile file="construction-light.glb" pos={[-14.3, 0, 0.3]} />
      <PlacedTile file="dumpster.glb" pos={[-16.2, 0, -0.6]} rot={Math.PI / 6} />

      {/* Night Street Light Illuminations */}
      {isNight && (
        <group>
          <spotLight position={[8.5, 1.8, 0.6]} target-position={[8.5, 0, 0]} angle={0.6} penumbra={0.6} intensity={2.2} color="#fef08a" distance={6} />
          <spotLight position={[11.5, 1.8, 0.6]} target-position={[11.5, 0, 0]} angle={0.6} penumbra={0.6} intensity={2.2} color="#fef08a" distance={6} />
          <spotLight position={[1.8, 1.8, 1.8]} target-position={[1.2, 0, 1.2]} angle={0.6} penumbra={0.6} intensity={2.5} color="#fef08a" distance={6} />
          <spotLight position={[-1.8, 1.8, 1.8]} target-position={[-1.2, 0, 1.2]} angle={0.6} penumbra={0.6} intensity={2.5} color="#fef08a" distance={6} />
          <spotLight position={[14.6, 1.8, 0.6]} target-position={[14, 0, 0]} angle={0.6} penumbra={0.6} intensity={2.2} color="#fef08a" distance={6} />
        </group>
      )}

      {/* ============================================================ */}
      {/* 6. CAMBODIAN PALM GROVES & NATURE (ដើមត្នោតកម្ពុជា)           */}
      {/* ============================================================ */}
      {/* Central Plaza Palms */}
      <PalmTree position={[3.2, 0, -3.2]} scale={0.75} />
      <PalmTree position={[-3.2, 0, -3.2]} scale={0.8} />
      <PalmTree position={[-3.2, 0, 3.2]} scale={0.85} />
      <PalmTree position={[3.2, 0, 3.2]} scale={0.7} />

      {/* Riverside Palms (lining the 50m canal) */}
      {[-20, -16, -11, -8, -4, 3, 7, 11, 16, 20].map((pz, i) => (
        <group key={`river_palm_${i}`}>
          <PalmTree position={[8.2, 0, pz]} scale={0.7 + (i % 3) * 0.15} />
          <PalmTree position={[11.8, 0, pz + 1.5]} scale={0.65 + (i % 2) * 0.2} />
        </group>
      ))}

      {/* East Countryside Palm Plantation */}
      <PalmTree position={[18, 0, -7]} scale={0.9} />
      <PalmTree position={[17, 0, -9]} scale={0.8} />
      <PalmTree position={[19, 0, -5]} scale={0.75} />
      <PalmTree position={[18, 0, 7]} scale={0.85} />
      <PalmTree position={[17, 0, 9]} scale={0.7} />
      <PalmTree position={[19, 0, 5]} scale={0.95} />

      {/* West Old Market Park Palms */}
      <PalmTree position={[-9, 0, -3.5]} scale={0.75} />
      <PalmTree position={[-15, 0, -3.5]} scale={0.85} />
      <PalmTree position={[-9, 0, 3.5]} scale={0.8} />
      <PalmTree position={[-15, 0, 3.5]} scale={0.7} />

      {/* Outer Far Corners Palms */}
      <PalmTree position={[-20, 0, -18]} scale={0.9} />
      <PalmTree position={[-20, 0, 18]} scale={0.85} />
      <PalmTree position={[20, 0, -18]} scale={0.95} />
      <PalmTree position={[20, 0, 18]} scale={0.9} />

      {/* ============================================================ */}
      {/* 7. VAST CAMBODIAN COUNTRYSIDE TERRAIN (120x120 UNITS)        */}
      {/* ============================================================ */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color={isNight ? "#09140e" : "#2d5225"}
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}
