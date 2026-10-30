import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { soundFX } from "../utils/audio";
import { Volume2, VolumeX, ArrowLeft } from "lucide-react";

export function GamePlayPage() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());

  useEffect(() => {
    // Start ambient background sound on entry
    soundFX.startAmbient();

    return () => {
      // Clean up ambient sound when leaving the page
      soundFX.stopAmbient();
    };
  }, []);

  const handleToggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 40%, #0f172a 0%, #030712 100%)",
      }}
      onClick={() => {
        // Ensure browser audio context starts if suspended by autoplay policy
        if (!isMuted) {
          soundFX.startAmbient();
        }
      }}
    >
      {/* Minimal Top Controls: Only Back button & Sound Toggle */}
      <div
        style={{
          position: "absolute",
          top: "max(12px, env(safe-area-inset-top))",
          right: "max(16px, env(safe-area-inset-right))",
          left: "max(16px, env(safe-area-inset-left))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        {/* Subtle Back to Lobby Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            navigate("/");
          }}
          style={{
            pointerEvents: "auto",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(10, 16, 26, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          }}
          title="ត្រឡប់ទៅវិញ (Back to Lobby)"
        >
          <ArrowLeft size={16} />
        </button>

        {/* Pure Sound Control Icon Button */}
        <button
          onClick={handleToggleSound}
          style={{
            pointerEvents: "auto",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: isMuted
              ? "rgba(15, 23, 42, 0.7)"
              : "linear-gradient(135deg, rgba(30, 58, 102, 0.9) 0%, rgba(14, 165, 233, 0.8) 100%)",
            border: isMuted
              ? "1px solid rgba(255, 255, 255, 0.2)"
              : "1.5px solid #38bdf8",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: isMuted
              ? "0 4px 12px rgba(0, 0, 0, 0.5)"
              : "0 0 16px rgba(56, 189, 248, 0.5)",
            transition: "all 0.2s ease",
          }}
          title={isMuted ? "បើកសំឡេង (Unmute Sound)" : "បិទសំឡេង (Mute Sound)"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
}
