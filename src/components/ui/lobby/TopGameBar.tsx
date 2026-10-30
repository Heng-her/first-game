import { MessageSquare, Settings, Power } from "lucide-react";
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
    width: 38,
    height: 38,
    borderRadius: 6,
    background: "rgba(10, 16, 26, 0.75)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
  };

  return (
    <header
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      {/* Top-Left: [ESC] SELECT CHARACTER */}
      <div
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* ESC Key pill */}
        <div
          style={{
            padding: "3px 8px",
            borderRadius: 4,
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0,0,0,0.5)",
            fontSize: 11,
            fontWeight: 800,
            color: "#e2e8f0",
            letterSpacing: 1,
          }}
        >
          ESC
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "#f8fafc",
              letterSpacing: 2,
              textTransform: "uppercase",
              textShadow: "0 2px 6px rgba(0, 0, 0, 0.9)",
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: 12,
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
          gap: 8,
        }}
      >
        {/* Lore / Chat */}
        <button
          style={iconBtnStyle}
          title="ព័ត៌មាន និងប្រវត្តិ (Lore / Guide)"
          onClick={() => {
            soundFX.playClick();
            onOpenGuide?.();
          }}
          onMouseEnter={() => soundFX.playHover()}
        >
          <MessageSquare size={17} />
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
          <Settings size={17} />
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
          <Power size={17} />
        </button>
      </div>
    </header>
  );
}
