import type { CharacterOption } from "../../../types/game";
import { Sparkles, Shield, Zap } from "lucide-react";

export interface CharacterShowcaseProps {
  character: CharacterOption;
}

export function CharacterShowcase({ character }: CharacterShowcaseProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* Dynamic Background Atmosphere - Warm Angkor Sunlight & Landscape */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 35%, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0) 65%), linear-gradient(180deg, rgba(8, 14, 25, 0.4) 0%, rgba(5, 8, 15, 0.85) 100%)",
          zIndex: 1,
        }}
      />

      {/* Sun Ray Beams from Top-Center */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "30%",
          width: "40%",
          height: "80%",
          background: "radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.18) 0%, rgba(245, 158, 11, 0) 70%)",
          transform: "rotate(-10deg)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Hero Character Visual Presentation */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        {/* Ground Pedestal Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: -30,
            width: 320,
            height: 48,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 75%)",
            filter: "blur(6px)",
            zIndex: 1,
          }}
        />

        {/* Character Avatar / High-Fidelity Figure */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            width: 440,
            height: 540,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "characterIdle 5s ease-in-out infinite",
          }}
        >
          <img
            src="/models/characters/image.png"
            alt={character.nameKm}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.7))",
            }}
            onError={(e) => {
              // Graceful fallback if image is loading or missing
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          {/* Backup Big Avatar Icon if image is hidden */}
          <div
            style={{
              display: "none", // used as fallback if needed
              fontSize: 140,
              filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.6))",
            }}
          >
            {character.avatarIcon}
          </div>
        </div>

        {/* Character Floating Nameplate & Status Badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            marginTop: 10,
            zIndex: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 18px",
              borderRadius: 20,
              background: "rgba(10, 16, 26, 0.85)",
              border: "1.5px solid rgba(245, 158, 11, 0.4)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Sparkles size={14} color="#fbbf24" />
            <span
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#f8fafc",
                letterSpacing: 0.5,
              }}
            >
              {character.nameKm}
            </span>
            <span style={{ fontSize: 13, color: "#fbbf24", fontWeight: 700 }}>
              ({character.roleKm})
            </span>
          </div>

          {/* Stat Pills */}
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: 11,
                color: "#94a3b8",
                fontWeight: 700,
              }}
            >
              <Zap size={11} color="#38bdf8" />
              <span>Speed: 100%</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: 11,
                color: "#94a3b8",
                fontWeight: 700,
              }}
            >
              <Shield size={11} color="#10b981" />
              <span>Heritage: Angkor</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes characterIdle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
