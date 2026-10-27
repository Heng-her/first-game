import { useState, useCallback, useMemo } from "react";
import { GameScene } from "./components/game/GameScene";
import { GameHUD } from "./components/ui/GameHUD";
import { MobileControls } from "./components/ui/MobileControls";
import { useKeyboardControls } from "./hooks/useKeyboardControls";
import type {
  PlayerControls,
  PlayerState,
  CollectibleItem,
} from "./types/game";

const INITIAL_COINS: CollectibleItem[] = [
  {
    id: "coin-1",
    position: [0, 5.6, 3],
    name: "Path Coin 1",
    nameKm: "កាក់ផ្លូវបុរាណ ១",
    points: 10,
    collected: false,
  },
  {
    id: "coin-2",
    position: [0, 5.7, -5],
    name: "Path Coin 2",
    nameKm: "កាក់ផ្លូវបុរាណ ២",
    points: 10,
    collected: false,
  },
  {
    id: "coin-3",
    position: [-4, 5.2, -15],
    name: "Temple Step Left",
    nameKm: "កាក់ជណ្តើរប្រាសាទឆ្វេង",
    points: 25,
    collected: false,
  },
  {
    id: "coin-4",
    position: [4, 5.8, -15],
    name: "Temple Step Right",
    nameKm: "កាក់ជណ្តើរប្រាសាទស្តាំ",
    points: 25,
    collected: false,
  },
  {
    id: "coin-5",
    position: [0, 5.5, -18],
    name: "Temple Inner Courtyard",
    nameKm: "កាក់ខឿនប្រាសាទកណ្តាល",
    points: 50,
    collected: false,
  },
  {
    id: "coin-6",
    position: [14, 5.8, 0],
    name: "East Garden Token",
    nameKm: "កាក់សួនខាងកើត",
    points: 15,
    collected: false,
  },
  {
    id: "coin-7",
    position: [28, 5.8, 0],
    name: "River Bridge Token",
    nameKm: "កាក់ស្ពានមាត់ទន្លេ",
    points: 30,
    collected: false,
  },
  {
    id: "coin-8",
    position: [-14, 3.6, -10],
    name: "Palm Grove Token",
    nameKm: "កាក់ព្រៃត្នោត",
    points: 20,
    collected: false,
  },
];

export default function App() {
  const keyboardControls = useKeyboardControls();
  const [touchControls, setTouchControls] = useState<Partial<PlayerControls>>(
    {},
  );

  // Combine keyboard and touch controls
  const activeControls = useMemo<PlayerControls>(
    () => ({
      forward: keyboardControls.forward || !!touchControls.forward,
      backward: keyboardControls.backward || !!touchControls.backward,
      left: keyboardControls.left || !!touchControls.left,
      right: keyboardControls.right || !!touchControls.right,
      run: keyboardControls.run || !!touchControls.run,
      jump: keyboardControls.jump || !!touchControls.jump,
      moveVector: touchControls.moveVector,
    }),
    [keyboardControls, touchControls],
  );

  const [playerState, setPlayerState] = useState<PlayerState>({
    position: [0, 4.85, 8],
    rotation: 0,
    isMoving: false,
    isRunning: false,
    isGrounded: true,
  });

  const [collectibles, setCollectibles] =
    useState<CollectibleItem[]>(INITIAL_COINS);
  const [cameraMode, setCameraMode] = useState<"follow" | "orbit">("follow");
  const [resetKey, setResetKey] = useState(0);

  // Active character model: defaults to MenKhStyle.glb (authentic Khmer traditional avatar)
  const [selectedModel, setSelectedModel] = useState<string>(
    "/models/characters/MenKhStyle.glb"
  );

  // Handle coin collection
  const handleCollectCoin = useCallback((id: string) => {
    setCollectibles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, collected: true } : c)),
    );
  }, []);

  // Handle touch control change
  const handleTouchControl = useCallback(
    <K extends keyof PlayerControls>(key: K, value: PlayerControls[K]) => {
      setTouchControls((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Reset player to start position
  const handleResetPosition = useCallback(() => {
    setResetKey((k) => k + 1);
    setPlayerState({
      position: [0, 4.85, 8],
      rotation: 0,
      isMoving: false,
      isRunning: false,
      isGrounded: true,
    });
  }, []);

  const collectedCount = collectibles.filter((c) => c.collected).length;

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 3D WebGL Canvas Scene */}
      <GameScene
        key={`${resetKey}-${selectedModel}`}
        controls={activeControls}
        playerState={playerState}
        onPlayerStateChange={setPlayerState}
        collectibles={collectibles}
        onCollectCoin={handleCollectCoin}
        cameraMode={cameraMode}
        modelUrl={selectedModel}
      />

      {/* Modern Khmer Game HUD with Diegetic UI */}
      <GameHUD
        playerState={playerState}
        collectedCount={collectedCount}
        totalCoins={collectibles.length}
        collectibles={collectibles}
        cameraMode={cameraMode}
        onToggleCamera={() =>
          setCameraMode((m) => (m === "follow" ? "orbit" : "follow"))
        }
        onResetPosition={handleResetPosition}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />

      {/* Mobile Touch Controls for Touch/Mobile Devices */}
      <MobileControls
        onControlChange={handleTouchControl}
        isRunning={activeControls.run}
      />
    </main>
  );
}
