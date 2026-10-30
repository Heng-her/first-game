import type { StageOption } from "../../../types/game";
import { X, MapPin, Clock, Award, Lock, Check } from "lucide-react";
import { soundFX } from "../../../utils/audio";

export interface StagesOverlayProps {
  stages: StageOption[];
  selectedStageId: string;
  onSelectStage: (id: string) => void;
  onClose: () => void;
}

export function StagesOverlay({
  stages,
  selectedStageId,
  onSelectStage,
  onClose,
}: StagesOverlayProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(3, 7, 18, 0.82)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          background: "linear-gradient(180deg, rgba(14, 20, 31, 0.98) 0%, rgba(8, 12, 20, 0.99) 100%)",
          border: "2px solid rgba(80, 100, 130, 0.6)",
          borderRadius: 12,
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(0, 0, 0, 0.7)",
          padding: "24px 28px",
          color: "#f8fafc",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            paddingBottom: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fbbf24", letterSpacing: 1 }}>
              ជ្រើសរើសវគ្គទេសចរណ៍ (SELECT DESTINATION & STAGE)
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              ជ្រើសរើសតំបន់ប្រវត្តិសាស្ត្រ ឬរបៀបលេងដែលអ្នកចង់ចូលផ្សងព្រេង
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#e2e8f0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Stage Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            maxHeight: "65vh",
            overflowY: "auto",
            paddingRight: 6,
          }}
        >
          {stages.map((stage) => {
            const isSelected = stage.id === selectedStageId;

            return (
              <div
                key={stage.id}
                onClick={() => {
                  if (stage.isUnlocked) {
                    soundFX.playClick();
                    onSelectStage(stage.id);
                  }
                }}
                onMouseEnter={() => {
                  if (stage.isUnlocked) soundFX.playHover();
                }}
                style={{
                  padding: "16px",
                  borderRadius: 8,
                  cursor: stage.isUnlocked ? "pointer" : "not-allowed",
                  opacity: stage.isUnlocked ? 1 : 0.5,
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(30, 58, 102, 0.8) 0%, rgba(15, 28, 48, 0.6) 100%)"
                    : "rgba(255, 255, 255, 0.03)",
                  border: isSelected
                    ? "2px solid #38bdf8"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: isSelected
                    ? "0 0 20px rgba(56, 189, 248, 0.3)"
                    : "none",
                  transition: "all 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ fontSize: 32 }}>{stage.thumbnail}</div>
                    {isSelected ? (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: "#0284c7",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Check size={12} />
                        បានជ្រើសរើស
                      </span>
                    ) : stage.isUnlocked ? (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "#34d399",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        អាចលេងបាន
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: "rgba(255, 255, 255, 0.05)",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Lock size={11} />
                        ចាក់សោ
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc", marginBottom: 4 }}>
                    {stage.nameKm}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: "#fbbf24",
                      marginBottom: 8,
                    }}
                  >
                    <MapPin size={13} />
                    <span>{stage.locationKm}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, marginBottom: 12 }}>
                    {stage.descriptionKm}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 10,
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    fontSize: 11,
                    color: "#94a3b8",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} />
                    <span>{stage.durationKm}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Award size={12} />
                    <span>{stage.difficultyKm}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
