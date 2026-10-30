import { useState } from "react";
import type { CharacterOption } from "../../../types/game";
import { Plus, MoreHorizontal, Globe, RefreshCw, Signal } from "lucide-react";
import { soundFX } from "../../../utils/audio";

export interface CharacterSlotPanelProps {
  characters: CharacterOption[];
  selectedId: string;
  onSelectCharacter: (id: string) => void;
  onViewStages: () => void;
  onCreateNew?: () => void;
}

export function CharacterSlotPanel({
  characters,
  selectedId,
  onSelectCharacter,
  onViewStages,
  onCreateNew,
}: CharacterSlotPanelProps) {
  const [region] = useState("សៀមរាប • អង្គរវត្ត");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    soundFX.playClick();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <aside
      style={{
        position: "absolute",
        left: "max(14px, env(safe-area-inset-left))",
        top: "max(44px, calc(env(safe-area-inset-top) + 38px))",
        bottom: "max(12px, env(safe-area-inset-bottom))",
        width: "clamp(240px, 32vw, 290px)",
        zIndex: 25,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 8,
        pointerEvents: "auto",
      }}
    >
      {/* Stone & Metal Frame Box with Scroll for Mobile Horizontal */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(180deg, rgba(14, 20, 31, 0.94) 0%, rgba(9, 13, 22, 0.96) 100%)",
          border: "1.5px solid rgba(80, 100, 130, 0.45)",
          borderRadius: 8,
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.8), inset 0 0 16px rgba(0, 0, 0, 0.6)",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          backdropFilter: "blur(10px)",
          overflowY: "auto",
        }}
      >
        {/* Section 1: Region & Characters Count */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: 6,
          }}
        >
          {/* Region selector */}
          <div>
            <div
              style={{
                fontSize: 9,
                color: "#64748b",
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              REGION
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "2px 8px",
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontSize: 11,
                color: "#e2e8f0",
                fontWeight: 700,
              }}
            >
              <Signal size={10} color="#10b981" />
              <span>{region}</span>
              <span style={{ fontSize: 8, color: "#94a3b8" }}>▾</span>
            </div>
          </div>

          {/* Characters Count */}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 9,
                color: "#64748b",
                fontWeight: 800,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              CHARACTERS:
            </div>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#fbbf24" }}>
              {characters.length} / 5
            </div>
          </div>
        </div>

        {/* Section 2: Character Slots List */}
        <div>
          <div
            style={{
              fontSize: 9,
              color: "#64748b",
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            CHARACTERS
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {characters.map((char, index) => {
              const isSelected = char.id === selectedId;
              const level = 60 - index * 5;

              return (
                <div
                  key={char.id}
                  onClick={() => {
                    soundFX.playClick();
                    onSelectCharacter(char.id);
                  }}
                  onMouseEnter={() => soundFX.playHover()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 9px",
                    borderRadius: 6,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    background: isSelected
                      ? "linear-gradient(90deg, rgba(30, 58, 102, 0.75) 0%, rgba(15, 28, 48, 0.6) 100%)"
                      : "rgba(255, 255, 255, 0.03)",
                    border: isSelected
                      ? "1px solid #38bdf8"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: isSelected
                      ? "0 0 12px rgba(56, 189, 248, 0.25)"
                      : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    {/* Diamond Level Badge */}
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 1,
                          background: isSelected ? "#0284c7" : "rgba(255, 255, 255, 0.1)",
                          border: isSelected ? "1px solid #7dd3fc" : "1px solid rgba(255, 255, 255, 0.2)",
                          transform: "rotate(45deg)",
                        }}
                      />
                      <span
                        style={{
                          position: "relative",
                          fontSize: 10,
                          fontWeight: 900,
                          color: "#ffffff",
                        }}
                      >
                        {level}
                      </span>
                    </div>

                    {/* Name & Title */}
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: isSelected ? "#f8fafc" : "#cbd5e1",
                          lineHeight: 1.1,
                        }}
                      >
                        {char.nameKm}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: isSelected ? "#93c5fd" : "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        {char.roleKm}
                      </div>
                    </div>
                  </div>

                  <div style={{ color: "#64748b", display: "flex", alignItems: "center" }}>
                    <MoreHorizontal size={14} />
                  </div>
                </div>
              );
            })}

            {/* Create Character button */}
            <button
              onClick={() => {
                soundFX.playClick();
                onCreateNew?.();
              }}
              onMouseEnter={() => soundFX.playHover()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 6,
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px dashed rgba(255, 255, 255, 0.2)",
                color: "#94a3b8",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={10} />
              </div>
              <span>បង្កើតតួអង្គថ្មី</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons (View Stages & Refresh) */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => {
            soundFX.playClick();
            onViewStages();
          }}
          onMouseEnter={() => soundFX.playHover()}
          style={{
            flex: 1.2,
            padding: "7px 8px",
            borderRadius: 6,
            background: "rgba(14, 20, 31, 0.9)",
            border: "1px solid rgba(80, 100, 130, 0.5)",
            color: "#e2e8f0",
            fontSize: 11,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            transition: "all 0.15s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          <Globe size={12} color="#38bdf8" />
          <span>វគ្គ (Stages)</span>
        </button>

        <button
          onClick={handleRefresh}
          onMouseEnter={() => soundFX.playHover()}
          style={{
            flex: 0.8,
            padding: "7px 8px",
            borderRadius: 6,
            background: "rgba(14, 20, 31, 0.9)",
            border: "1px solid rgba(80, 100, 130, 0.5)",
            color: "#cbd5e1",
            fontSize: 11,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            transition: "all 0.15s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          <RefreshCw
            size={11}
            style={{
              transition: "transform 0.5s ease",
              transform: isRefreshing ? "rotate(360deg)" : "none",
            }}
          />
          <span>Refresh</span>
        </button>
      </div>
    </aside>
  );
}
