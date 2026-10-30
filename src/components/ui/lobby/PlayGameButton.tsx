import { soundFX } from "../../../utils/audio";

export interface PlayGameButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function PlayGameButton({ onClick, disabled = false }: PlayGameButtonProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 36,
        right: 36,
        zIndex: 30,
        pointerEvents: "auto",
      }}
    >
      <button
        onClick={() => {
          soundFX.playPlayButton();
          onClick();
        }}
        onMouseEnter={() => soundFX.playHover()}
        disabled={disabled}
        className="game-play-btn"
        style={{
          width: 250,
          height: 64,
          background: "linear-gradient(180deg, #1e3a8a 0%, #0d1e42 60%, #091224 100%)",
          border: "2px solid #38bdf8",
          borderRadius: 6,
          boxShadow: "0 0 24px rgba(56, 189, 248, 0.4), inset 0 0 12px rgba(56, 189, 248, 0.3), 0 12px 30px rgba(0, 0, 0, 0.8)",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Inner Glow Border */}
        <div
          style={{
            position: "absolute",
            inset: 3,
            border: "1px solid rgba(125, 211, 252, 0.6)",
            borderRadius: 3,
            pointerEvents: "none",
          }}
        />

        {/* Text PLAY */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: 8,
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(56, 189, 248, 0.8), 0 2px 4px rgba(0,0,0,0.8)",
            lineHeight: 1.1,
          }}
        >
          PLAY
        </div>

        {/* Khmer Subtitle */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#93c5fd",
            letterSpacing: 1.5,
            opacity: 0.85,
            marginTop: 2,
          }}
        >
          ចាប់ផ្តើមផ្សងព្រេង
        </div>
      </button>

      <style>{`
        .game-play-btn:hover {
          transform: translateY(-2px) scale(1.02);
          border-color: #60a5fa !important;
          box-shadow: 0 0 35px rgba(59, 130, 246, 0.7), inset 0 0 16px rgba(56, 189, 248, 0.5), 0 16px 36px rgba(0, 0, 0, 0.9) !important;
        }
        .game-play-btn:active {
          transform: translateY(1px) scale(0.99);
        }
      `}</style>
    </div>
  );
}
