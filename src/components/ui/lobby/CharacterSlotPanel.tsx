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
  const [region] = useState("សៀមរាប • អង្គរវត្ត (Angkor Realm)");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    soundFX.playClick();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <aside
      style={{
        position: "absolute",
        left: 28,
        top: 76,
        bottom: 36,
        width: 360,
        zIndex: 25,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        pointerEvents: "auto",
      }}
    >
      {/* Stone & Metal Frame Box */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(14, 20, 31, 0.94) 0%, rgba(9, 13, 22, 0.96) 100%)",
          border: "1.5px solid rgba(80, 100, 130, 0.45)",
          borderRadius: 8,
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.6)",
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Section 1: Region & Characters Count */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: 12,
          }}
        >
          {/* Region selector */}
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#64748b",
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              តំបន់ (REGION)
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontSize: 12,
                color: "#e2e8f0",
                fontWeight: 700,
              }}
            >
              <Signal size={12} color="#10b981" />
              <span>{region}</span>
              <span style={{ fontSize: 9, color: "#94a3b8" }}>▾</span>
            </div>
          </div>

          {/* Characters Count */}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 10,
                color: "#64748b",
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              CHARACTERS:
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fbbf24" }}>
              {characters.length} / 5
            </div>
          </div>
        </div>

        {/* Section 2: Character Slots List */}
        <div>
          <div
            style={{
              fontSize: 10,
              color: "#64748b",
              fontWeight: 800,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            CHARACTERS
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                    padding: "10px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    background: isSelected
                      ? "linear-gradient(90deg, rgba(30, 58, 102, 0.7) 0%, rgba(15, 28, 48, 0.5) 100%)"
                      : "rgba(255, 255, 255, 0.03)",
                    border: isSelected
                      ? "1px solid #38bdf8"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: isSelected
                      ? "0 0 16px rgba(56, 189, 248, 0.25)"
                      : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Diamond Level Badge */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 2,
                          background: isSelected ? "#0284c7" : "rgba(255, 255, 255, 0.1)",
                          border: isSelected ? "1px solid #7dd3fc" : "1px solid rgba(255, 255, 255, 0.2)",
                          transform: "rotate(45deg)",
                        }}
                      />
                      <span
                        style={{
                          position: "relative",
                          fontSize: 12,
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
                          fontSize: 14,
                          fontWeight: 800,
                          color: isSelected ? "#f8fafc" : "#cbd5e1",
                          lineHeight: 1.2,
                        }}
                      >
                        {char.nameKm}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: isSelected ? "#93c5fd" : "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        {char.roleKm}
                      </div>
                    </div>
                  </div>

                  <div style={{ color: "#64748b", display: "flex", alignItems: "center" }}>
                    <MoreHorizontal size={16} />
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
                gap: 8,
                padding: "10px 14px",
                borderRadius: 6,
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px dashed rgba(255, 255, 255, 0.2)",
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
                marginTop: 4,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={12} />
              </div>
              <span>បង្កើតតួអង្គថ្មី (Create Character)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button
          onClick={() => {
            soundFX.playClick();
            onViewStages();
          }}
          onMouseEnter={() => soundFX.playHover()}
          style={{
            flex: 1,
            padding: "9px 12px",
            borderRadius: 6,
            background: "rgba(14, 20, 31, 0.9)",
            border: "1px solid rgba(80, 100, 130, 0.5)",
            color: "#e2e8f0",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all 0.15s ease",
            boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
          }}
        >
          <Globe size={14} color="#38bdf8" />
          <span>ជ្រើសវគ្គ (View Stages)</span>
        </button>

        <button
          onClick={handleRefresh}
          onMouseEnter={() => soundFX.playHover()}
          style={{
            flex: 1,
            padding: "9px 12px",
            borderRadius: 6,
            background: "rgba(14, 20, 31, 0.9)",
            border: "1px solid rgba(80, 100, 130, 0.5)",
            color: "#cbd5e1",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all 0.15s ease",
            boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
          }}
        >
          <RefreshCw
            size={13}
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
