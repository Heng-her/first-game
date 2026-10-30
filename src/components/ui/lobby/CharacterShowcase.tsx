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
        paddingLeft: "clamp(120px, 16vw, 180px)", // Offsets character toward center-right to balance left panel on landscape mobile
      }}
    >
      {/* Dynamic Background Atmosphere - Warm Angkor Sunlight & Landscape */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 55% 40%, rgba(245, 158, 11, 0.16) 0%, rgba(15, 23, 42, 0) 65%), linear-gradient(180deg, rgba(8, 14, 25, 0.4) 0%, rgba(5, 8, 15, 0.88) 100%)",
          zIndex: 1,
        }}
      />

      {/* Sun Ray Beams from Top-Center */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "40%",
          width: "45%",
          height: "90%",
          background: "radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.16) 0%, rgba(245, 158, 11, 0) 70%)",
          transform: "rotate(-10deg)",
          filter: "blur(35px)",
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
          marginTop: 10,
        }}
      >
        {/* Ground Pedestal Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: -16,
            width: "clamp(180px, 28vw, 260px)",
            height: "clamp(24px, 4vh, 36px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 75%)",
            filter: "blur(5px)",
            zIndex: 1,
          }}
        />

        {/* Character Avatar / High-Fidelity Figure scaled for mobile landscape */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            height: "clamp(210px, 72vh, 320px)",
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
              height: "100%",
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.75))",
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Character Floating Nameplate & Status Badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            marginTop: 4,
            zIndex: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 16,
              background: "rgba(10, 16, 26, 0.85)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Sparkles size={12} color="#fbbf24" />
            <span
              style={{
                fontSize: "clamp(12px, 1.6vw, 14px)",
                fontWeight: 900,
                color: "#f8fafc",
                letterSpacing: 0.3,
              }}
            >
              {character.nameKm}
            </span>
            <span style={{ fontSize: "clamp(10px, 1.3vw, 12px)", color: "#fbbf24", fontWeight: 700 }}>
              ({character.roleKm})
            </span>
          </div>

          {/* Stat Pills */}
          <div style={{ display: "flex", gap: 6 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 7px",
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: 9,
                color: "#94a3b8",
                fontWeight: 700,
              }}
            >
              <Zap size={10} color="#38bdf8" />
              <span>Speed: 100%</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 7px",
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: 9,
                color: "#94a3b8",
                fontWeight: 700,
              }}
            >
              <Shield size={10} color="#10b981" />
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
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}
