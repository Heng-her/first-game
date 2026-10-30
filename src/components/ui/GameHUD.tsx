import { useEffect, useRef } from "react";
import { RotateCcw, Video, Coins, Compass as CompassIcon } from "lucide-react";
import type { PlayerState, CollectibleItem } from "../../types/game";
import { BrassCompass } from "./BrassCompass";
import { soundFX } from "../../utils/audio";

interface GameHUDProps {
  playerState: PlayerState;
  collectedCount: number;
  totalCoins: number;
  cameraMode: "follow" | "orbit";
  onToggleCamera: () => void;
  onResetPosition: () => void;
  selectedModel?: string;
  onSelectModel?: (model: string) => void;
  collectibles?: CollectibleItem[];
}

export function GameHUD({
  playerState,
  collectedCount,
  totalCoins,
  cameraMode,
  onToggleCamera,
  onResetPosition,
}: GameHUDProps) {
  const isAllCollected = collectedCount >= totalCoins && totalCoins > 0;
  const prevCountRef = useRef(collectedCount);

  // Play subtle sound when coin is picked up
  useEffect(() => {
    if (collectedCount > prevCountRef.current) {
      soundFX.playCoinChime();
    }
    prevCountRef.current = collectedCount;
  }, [collectedCount]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "16px 20px",
      }}
    >
      {/* Top Clean Navigation & Status Bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          width: "100%",
        }}
      >
        {/* Top-Left: Clean Minimal Quest Info */}
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              border: "1.5px solid rgba(245, 158, 11, 0.4)",
              background: "rgba(15, 23, 42, 0.92)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              maxWidth: 360,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <CompassIcon size={18} color="#f59e0b" />
              <div style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc" }}>
                ដំណើរផ្សងព្រេងអង្គរ (Angkor Adventure)
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                color: isAllCollected ? "#34d399" : "#cbd5e1",
                fontWeight: 600,
              }}
            >
              {isAllCollected
                ? "🎉 អបអរសាទរ! អ្នកបានប្រមូលកាក់មាសទាំងអស់ជោគជ័យ!"
                : `🎯 បេសកកម្ម៖ រុករកប្រាសាទ និងប្រមូលកាក់បុរាណ (${collectedCount}/${totalCoins})`}
            </div>
          </div>
        </div>

        {/* Top-Right: Clean Brass Compass & Control Buttons */}
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* Coin Counter */}
          <div
            className="glass-panel"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderRadius: 16,
              border: isAllCollected
                ? "2px solid #10b981"
                : "2px solid #d97706",
              background: "rgba(15, 23, 42, 0.92)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
          >
            <Coins size={24} color="#fbbf24" className="animate-float" />
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  fontWeight: 700,
                }}
              >
                កាក់ប្រមូលបាន
              </div>
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 900,
                  color: "#fbbf24",
                  lineHeight: 1,
                }}
              >
                {collectedCount}{" "}
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  / {totalCoins}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Tangible Brass Compass */}
          <BrassCompass rotation={playerState.rotation} size={92} />

          {/* Action Buttons Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Camera Viewfinder Toggle Button */}
            <button
              onClick={() => {
                soundFX.playPaperFlip();
                onToggleCamera();
              }}
              className="tactile-button"
              style={{
                width: 42,
                height: 42,
                padding: 0,
                borderRadius: "50%",
                border: "1.5px solid #d97706",
              }}
              title={
                cameraMode === "follow"
                  ? "ប្តូរទៅ Orbit Camera"
                  : "ប្តូរទៅ Follow Camera"
              }
            >
              <Video size={19} color="#fbbf24" />
            </button>

            {/* Reset Position Button */}
            <button
              onClick={() => {
                soundFX.playPaperFlip();
                onResetPosition();
              }}
              className="tactile-button"
              style={{
                width: 42,
                height: 42,
                padding: 0,
                borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.3)",
              }}
              title="ត្រឡប់ទៅចំណុចចាប់ផ្តើម (Reset Position)"
            >
              <RotateCcw size={19} color="#cbd5e1" />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Bar: Instructions hint */}
      <footer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: "8px 20px",
            borderRadius: 24,
            fontSize: 12,
            color: "#cbd5e1",
            letterSpacing: 0.3,
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
          }}
        >
          ប្រើប្រាស់ <strong style={{ color: "#fbbf24" }}>W, A, S, D</strong>{" "}
          ដើម្បីដើរ | <strong style={{ color: "#fbbf24" }}>Shift</strong> រត់ |{" "}
          <strong style={{ color: "#fbbf24" }}>Space</strong> លោត
        </div>
      </footer>
    </div>
  );
}
