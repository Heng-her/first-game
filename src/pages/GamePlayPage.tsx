import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { soundFX } from "../utils/audio";
import { CharacterPreview3D } from "../components/game/CharacterPreview3D";
import { getActiveCharacter } from "../data/characters";

export function GamePlayPage() {
  const navigate = useNavigate();
  const activeChar = getActiveCharacter();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        background: "radial-gradient(ellipse at 50% 40%, #0f172a 0%, #030712 100%)",
      }}
    >
      {/* Pure 3D Character Viewport without any UI overlays */}
      <div style={{ position: "absolute", inset: 0 }}>
        <CharacterPreview3D character={activeChar} autoRotate={true} />
      </div>

      {/* Minimal Floating Back to Home Button */}
      <div
        style={{
          position: "absolute",
          top: "max(14px, env(safe-area-inset-top))",
          left: "max(16px, env(safe-area-inset-left))",
          zIndex: 40,
        }}
      >
        <button
          onClick={() => {
            soundFX.playClick();
            navigate("/");
          }}
          style={{
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
          title="ត្រឡប់ទៅទំព័រដើម (Back to Home)"
        >
          <ArrowLeft size={19} />
        </button>
      </div>
    </div>
  );
}
