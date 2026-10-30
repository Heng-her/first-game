import { Suspense, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { ArrowLeft } from "lucide-react";
import { CityTrackScene } from "../components/game/CityTrackScene";
import { RoadFollowCamera } from "../components/game/RoadFollowCamera";
import { VirtualJoystick } from "../components/ui/common/VirtualJoystick";
import type { SoldierState, VirtualInput } from "../data/soldierConfig";
import { MOVEMENT_CONFIG } from "../data/soldierConfig";
import { soundFX } from "../utils/audio";

export function RoadsViewerPage() {
  const navigate = useNavigate();

  // Mutable soldier state ref (prevents re-rendering 3D canvas at 60fps)
  const soldierStateRef = useRef<SoldierState>({
    pos: new THREE.Vector3(...MOVEMENT_CONFIG.initialPosition),
    rotation: 0,
    isMoving: false,
    isRunning: false,
    currentSpeed: 0,
    forwardInput: 0,
  });

  // Mobile circular touch joystick input ref (analogue direction + sprint)
  const virtualInputRef = useRef<VirtualInput>({
    forward: 0,
    side: 0,
    isRunning: false,
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 30%, #0f172a 0%, #020617 100%)",
        color: "#f8fafc",
        fontFamily: "var(--font-km)",
      }}
    >
      {/* 1. MINIMAL FLOATING BACK TO LOBBY BUTTON */}
      <div
        style={{
          position: "absolute",
          top: "max(14px, env(safe-area-inset-top))",
          left: "max(16px, env(safe-area-inset-left))",
          zIndex: 40,
          pointerEvents: "none",
        }}
      >
        <button
          onClick={() => {
            soundFX.playClick();
            navigate("/");
          }}
          style={{
            pointerEvents: "auto",
            width: 42,
            height: 42,
            borderRadius: "14px",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
            color: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.4)",
          }}
          title="ត្រឡប់ទៅទំព័រដើម (Back)"
        >
          <ArrowLeft size={19} />
        </button>
      </div>

      {/* 2. MOBILE TOUCH CIRCLE CONTROLS (Hidden on Desktop, Visible as Circular Joystick on Mobile) */}
      <VirtualJoystick virtualInputRef={virtualInputRef} />

      {/* 3. FULLSCREEN 3D CANVAS VIEWPORT */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Canvas
          shadows
          camera={{
            position: [0, 2.5, 4.8],
            fov: 45,
          }}
        >
          {/* Ambient Lighting */}
          <ambientLight intensity={0.95} color="#fff7ed" />

          {/* Sun Directional Light with Soft Shadows */}
          <directionalLight
            position={[25, 35, 20]}
            intensity={2.0}
            color="#fef08a"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />

          {/* Golden glow at Central Plaza */}
          <pointLight position={[0, 10, 0]} intensity={0.7} color="#f59e0b" />

          {/* Dedicated Third-Person Follow Camera Controller */}
          <RoadFollowCamera soldierStateRef={soldierStateRef} enabled={true} />

          {/* 3D City Track Scene with Playable Soldier */}
          <Suspense fallback={null}>
            <CityTrackScene
              soldierStateRef={soldierStateRef}
              virtualInputRef={virtualInputRef}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
