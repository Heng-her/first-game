import { useState } from "react";
import { X, Volume2, Monitor, Sparkles } from "lucide-react";
import { soundFX } from "../../../utils/audio";

export interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [graphicsQuality, setGraphicsQuality] = useState<"Low" | "Medium" | "High">("High");
  const [sfxVolume, setSfxVolume] = useState<number>(80);
  const [musicVolume, setMusicVolume] = useState<number>(70);

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
          maxWidth: 540,
          background: "linear-gradient(180deg, rgba(14, 20, 31, 0.98) 0%, rgba(8, 12, 20, 0.99) 100%)",
          border: "2px solid rgba(80, 100, 130, 0.6)",
          borderRadius: 12,
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.9)",
          padding: "24px 28px",
          color: "#f8fafc",
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
            paddingBottom: 14,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fbbf24", letterSpacing: 1 }}>
            ការកំណត់ហ្គេម (GAME SETTINGS)
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            style={{
              width: 32,
              height: 32,
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

        {/* Settings Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Graphics Quality */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13, fontWeight: 800 }}>
              <Monitor size={16} color="#38bdf8" />
              <span>កម្រិតក្រាហ្វិក (Graphics Quality)</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {(["Low", "Medium", "High"] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    soundFX.playClick();
                    setGraphicsQuality(q);
                  }}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 6,
                    background: graphicsQuality === q ? "#0284c7" : "rgba(255, 255, 255, 0.05)",
                    border: graphicsQuality === q ? "1px solid #7dd3fc" : "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Sound FX */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, fontWeight: 800 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Volume2 size={16} color="#fbbf24" />
                <span>សំឡេងផលប៉ះពាល់ (Sound Effects)</span>
              </div>
              <span style={{ color: "#fbbf24" }}>{sfxVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
            />
          </div>

          {/* Music */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, fontWeight: 800 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={16} color="#10b981" />
                <span>តន្ត្រីប្រពៃណី (Atmospheric Music)</span>
              </div>
              <span style={{ color: "#10b981" }}>{musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            style={{
              padding: "9px 24px",
              borderRadius: 6,
              background: "#0284c7",
              border: "1px solid #38bdf8",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.4)",
            }}
          >
            រក្សាទុក (Save & Close)
          </button>
        </div>
      </div>
    </div>
  );
}
