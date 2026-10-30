import { MessageSquare, Settings, Power, ArrowLeft } from "lucide-react";
import { soundFX } from "../../../utils/audio";

export interface TopGameBarProps {
  title?: string;
  subtitle?: string;
  onOpenGuide?: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
}

export function TopGameBar({
  title = "SELECT CHARACTER",
  subtitle = "ជ្រើសរើសតួអង្គ",
  onOpenGuide,
  onOpenSettings,
  onExit,
}: TopGameBarProps) {
  const iconBtnStyle: React.CSSProperties = {
    width: "clamp(30px, 4.5vh, 36px)",
    height: "clamp(30px, 4.5vh, 36px)",
    borderRadius: 6,
    background: "rgba(10, 16, 26, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
  };

  return (
    <header
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "max(8px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) 6px max(16px, env(safe-area-inset-left))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      {/* Top-Left: [ESC / Arrow] SELECT CHARACTER */}
      <div
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* ESC Key pill (Touch friendly) */}
        <div
          onClick={() => {
            soundFX.playClick();
            onExit?.();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 7px",
            borderRadius: 4,
            background: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0,0,0,0.5)",
            fontSize: 10,
            fontWeight: 800,
            color: "#e2e8f0",
            letterSpacing: 0.8,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={11} />
          <span>ESC</span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              fontSize: "clamp(12px, 1.8vw, 15px)",
              fontWeight: 900,
              color: "#f8fafc",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.9)",
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: "clamp(10px, 1.4vw, 12px)",
              fontWeight: 700,
              color: "#fbbf24",
              opacity: 0.85,
            }}
          >
            {subtitle}
          </span>
        </div>
      </div>

      {/* Top-Right: Quick Utility Icons */}
      <div
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* Lore / Chat */}
        <button
          style={iconBtnStyle}
          title="មគ្គុទ្ទេសក៍ (Guide / Lore)"
          onClick={() => {
            soundFX.playClick();
            onOpenGuide?.();
          }}
          onMouseEnter={() => soundFX.playHover()}
        >
          <MessageSquare size={14} />
        </button>

        {/* Settings */}
        <button
          style={iconBtnStyle}
          title="ការកំណត់ (Settings)"
          onClick={() => {
            soundFX.playClick();
            onOpenSettings?.();
          }}
          onMouseEnter={() => soundFX.playHover()}
        >
          <Settings size={14} />
        </button>

        {/* Exit */}
        <button
          style={{ ...iconBtnStyle, color: "#f87171" }}
          title="ចាកចេញ (Exit)"
          onClick={() => {
            soundFX.playClick();
            onExit?.();
          }}
          onMouseEnter={() => soundFX.playHover()}
        >
          <Power size={14} />
        </button>
      </div>
    </header>
  );
}
