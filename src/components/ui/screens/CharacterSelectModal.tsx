import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Check,
  Sparkles,
  Zap,
  Shield,
  BookOpen,
  Play,
  RotateCw,
  Compass,
} from "lucide-react";
import type { CharacterOption } from "../../../types/game";
import {
  CHARACTERS_DATA,
  getActiveCharacter,
  setActiveCharacterId,
} from "../../../data/characters";
import { CharacterPreview3D } from "../../game/CharacterPreview3D";
import { soundFX } from "../../../utils/audio";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface CharacterSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (character: CharacterOption) => void;
}

export function CharacterSelectModal({
  isOpen,
  onClose,
  onSelectCharacter,
}: CharacterSelectModalProps) {
  const navigate = useNavigate();
  const [selectedChar, setSelectedChar] = useState<CharacterOption>(getActiveCharacter());
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSelect = (char: CharacterOption) => {
    soundFX.playClick();
    setSelectedChar(char);
  };

  const handleConfirm = () => {
    soundFX.playPlayButton();
    setActiveCharacterId(selectedChar.id);
    if (onSelectCharacter) {
      onSelectCharacter(selectedChar);
    }
    onClose();
  };

  const handleConfirmAndPlay = () => {
    soundFX.playPlayButton();
    setActiveCharacterId(selectedChar.id);
    if (onSelectCharacter) {
      onSelectCharacter(selectedChar);
    }
    onClose();
    navigate("/play");
  };

  const accent = selectedChar.accentColor || "#f59e0b";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(2, 6, 23, 0.85)",
        backdropFilter: "blur(12px)",
        padding: "16px",
        fontFamily: "var(--font-km)",
      }}
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1080px",
          maxHeight: "92vh",
          backgroundColor: "#0b1220",
          border: `1.5px solid ${accent}55`,
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          boxShadow: `0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px ${accent}22`,
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.6) 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "14px",
                background: `${accent}25`,
                border: `1.5px solid ${accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              {selectedChar.avatarIcon}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  ជ្រើសរើសតួអង្គផ្សងព្រេង
                </h2>
                <Badge variant="gold">
                  <Sparkles size={13} style={{ marginRight: 4 }} />
                  3D Avatar
                </Badge>
              </div>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "2px 0 0 0" }}>
                ជ្រើសរើសតួអង្គដែលអ្នកចូលចិត្តសម្រាប់ដំណើរកម្សាន្តទេសចរណ៍កម្ពុជា
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="បិទ (Close)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Main Body (2 Columns Layout) */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            padding: "24px",
          }}
        >
          {/* Left Column: 3D Live Interactive Viewport */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              height: "440px",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
                borderRadius: "18px",
                overflow: "hidden",
                border: `1.5px solid ${accent}44`,
                boxShadow: `0 8px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px ${accent}15`,
              }}
            >
              <CharacterPreview3D character={selectedChar} autoRotate={autoRotate} />

              {/* Viewport Overlay: Character Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    background: "rgba(10, 16, 26, 0.8)",
                    backdropFilter: "blur(8px)",
                    padding: "6px 14px",
                    borderRadius: "10px",
                    border: `1px solid ${accent}66`,
                    color: "#f8fafc",
                    fontSize: "14px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{selectedChar.avatarIcon}</span>
                  {selectedChar.nameKm} ({selectedChar.nameEn})
                </div>
                {selectedChar.badgeKm && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: accent,
                      background: "rgba(0, 0, 0, 0.6)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      width: "fit-content",
                    }}
                  >
                    ✦ {selectedChar.badgeKm}
                  </span>
                )}
              </div>

              {/* Viewport Control: Auto-Rotate Toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                style={{
                  position: "absolute",
                  bottom: 14,
                  right: 14,
                  background: autoRotate ? `${accent}cc` : "rgba(15, 23, 42, 0.85)",
                  border: `1px solid ${accent}`,
                  color: autoRotate ? "#0f172a" : "#cbd5e1",
                  borderRadius: "10px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                }}
              >
                <RotateCw size={13} style={{ animation: autoRotate ? "spin 3s linear infinite" : "none" }} />
                {autoRotate ? "បង្វិលសកម្ម" : "បង្វិលស្ងៀម"}
              </button>
            </div>

            {/* Instruction Tip */}
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Compass size={14} color="#38bdf8" />
              ចុចអូស Mouse ឬ Touch ដើម្បីបង្វិលមើលជុំវិញតួអង្គ 360°
            </div>
          </div>

          {/* Right Column: Character Selection Cards & Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 1. Character Choice Cards (Active State System) */}
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 10,
                }}
              >
                ជ្រើសរើសតួអង្គ (Select Avatar)
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                }}
              >
                {CHARACTERS_DATA.map((char: CharacterOption) => {
                  const isActive = selectedChar.id === char.id;
                  const charAccent = char.accentColor || "#f59e0b";

                  return (
                    <div
                      key={char.id}
                      onClick={() => handleSelect(char)}
                      style={{
                        position: "relative",
                        padding: "12px 14px",
                        borderRadius: "14px",
                        background: isActive
                          ? `linear-gradient(135deg, ${charAccent}22 0%, rgba(15, 23, 42, 0.9) 100%)`
                          : "rgba(15, 23, 42, 0.6)",
                        border: isActive
                          ? `2px solid ${charAccent}`
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        cursor: "pointer",
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: isActive
                          ? `0 6px 20px ${charAccent}33, inset 0 0 12px ${charAccent}15`
                          : "none",
                        transform: isActive ? "scale(1.02)" : "scale(1)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      {/* Active Indicator Pin */}
                      {isActive && (
                        <div
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: charAccent,
                            color: "#0f172a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 2px 8px ${charAccent}`,
                          }}
                        >
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}

                      {/* Character Avatar Icon */}
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "12px",
                          background: `${charAccent}25`,
                          border: `1.5px solid ${charAccent}88`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          flexShrink: 0,
                        }}
                      >
                        {char.avatarIcon}
                      </div>

                      {/* Name & Role */}
                      <div style={{ overflow: "hidden", textAlign: "left" }}>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: isActive ? "#ffffff" : "#e2e8f0",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {char.nameKm}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: isActive ? charAccent : "#94a3b8",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          {char.roleKm}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Active Character Details & Stats Panel */}
            <div
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {/* Description */}
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>
                  {selectedChar.nameKm} — {selectedChar.roleKm}
                </div>
                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
                  {selectedChar.descriptionKm}
                </p>
              </div>

              {/* Stats Progress Bars */}
              {selectedChar.stats && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Speed */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#cbd5e1", marginBottom: 4 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Zap size={13} color="#f59e0b" /> ល្បឿនរត់ (Speed)
                      </span>
                      <strong style={{ color: "#f59e0b" }}>{selectedChar.stats.speed}%</strong>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "rgba(255, 255, 255, 0.1)", borderRadius: 3, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${selectedChar.stats.speed}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
                          borderRadius: 3,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* Stamina */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#cbd5e1", marginBottom: 4 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Shield size={13} color="#10b981" /> ថាមពលធន់ (Stamina)
                      </span>
                      <strong style={{ color: "#10b981" }}>{selectedChar.stats.stamina}%</strong>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "rgba(255, 255, 255, 0.1)", borderRadius: 3, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${selectedChar.stats.stamina}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #10b981, #34d399)",
                          borderRadius: 3,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* Knowledge */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#cbd5e1", marginBottom: 4 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <BookOpen size={13} color="#06b6d4" /> ចំណេះដឹងតំបន់ (Knowledge)
                      </span>
                      <strong style={{ color: "#06b6d4" }}>{selectedChar.stats.knowledge}%</strong>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "rgba(255, 255, 255, 0.1)", borderRadius: 3, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${selectedChar.stats.knowledge}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #06b6d4, #38bdf8)",
                          borderRadius: 3,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Distinctive Features / Perks Chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: 4 }}>
                {selectedChar.features.map((feat: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "11px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#94a3b8",
                      padding: "3px 9px",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    ✦ {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            background: "rgba(10, 15, 26, 0.95)",
          }}
        >
          {/* Active summary */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>តួអង្គសកម្ម៖</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: accent }}>
              {selectedChar.avatarIcon} {selectedChar.nameKm} ({selectedChar.roleKm})
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="ghost" size="md" onClick={onClose}>
              បោះបង់ (Cancel)
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={<Check size={16} />}
              onClick={handleConfirm}
              style={{
                borderColor: accent,
                color: accent,
              }}
            >
              ជ្រើសរើស (Select)
            </Button>

            <Button
              variant="primary"
              size="md"
              icon={<Play size={16} />}
              onClick={handleConfirmAndPlay}
              style={{
                background: `linear-gradient(135deg, ${accent} 0%, #b45309 100%)`,
                boxShadow: `0 4px 16px ${accent}44`,
              }}
            >
              បញ្ជាក់ & ចូលលេង (Confirm & Play)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
