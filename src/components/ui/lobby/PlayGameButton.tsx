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
        bottom: "max(12px, env(safe-area-inset-bottom))",
        right: "max(16px, env(safe-area-inset-right))",
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
          width: "clamp(150px, 20vw, 200px)",
          height: "clamp(46px, 13vh, 56px)",
          background: "linear-gradient(180deg, #1e3a8a 0%, #0d1e42 60%, #091224 100%)",
          border: "2px solid #38bdf8",
          borderRadius: 6,
          boxShadow: "0 0 20px rgba(56, 189, 248, 0.45), inset 0 0 10px rgba(56, 189, 248, 0.3), 0 8px 24px rgba(0, 0, 0, 0.8)",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Inner Glow Border */}
        <div
          style={{
            position: "absolute",
            inset: 2,
            border: "1px solid rgba(125, 211, 252, 0.6)",
            borderRadius: 3,
            pointerEvents: "none",
          }}
        />

        {/* Text PLAY */}
        <div
          style={{
            fontSize: "clamp(16px, 2.2vw, 20px)",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: 6,
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
            fontSize: "clamp(8px, 1.1vw, 10px)",
            fontWeight: 800,
            color: "#93c5fd",
            letterSpacing: 1,
            opacity: 0.9,
            marginTop: 1,
          }}
        >
          ចាប់ផ្តើមផ្សងព្រេង
        </div>
      </button>

      <style>{`
        .game-play-btn:hover, .game-play-btn:active {
          transform: translateY(-2px) scale(1.02);
          border-color: #60a5fa !important;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.7), inset 0 0 14px rgba(56, 189, 248, 0.5), 0 12px 30px rgba(0, 0, 0, 0.9) !important;
        }
      `}</style>
    </div>
  );
}
