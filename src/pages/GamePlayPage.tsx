import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { STAGES_DATA, CHARACTERS_DATA } from "../data/gameData";
import { Button } from "../components/ui/common/Button";
import { Badge } from "../components/ui/common/Badge";
import {
  Compass,
  ArrowLeft,
  BookOpen,
  RotateCcw,
  Volume2,
  VolumeX,
  Coins,
} from "lucide-react";

export function GamePlayPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const stageId = searchParams.get("stage") || "angkor-treasure";
  const stage = STAGES_DATA.find((s) => s.id === stageId) || STAGES_DATA[0];

  const [characterId, setCharacterId] = useState<string>("khmer-male");
  const [collectedCoins, setCollectedCoins] = useState<number>(0);
  const totalCoins = stage.totalCoins || 8;
  const [isMuted, setIsMuted] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  useEffect(() => {
    const charParam = searchParams.get("character");
    if (charParam) {
      setCharacterId(charParam);
    } else {
      const savedChar = localStorage.getItem("selectedCharacterId");
      if (savedChar) setCharacterId(savedChar);
    }
  }, [searchParams]);

  const character =
    CHARACTERS_DATA.find((c) => c.id === characterId) || CHARACTERS_DATA[0];

  const handleCollectSimulatedCoin = () => {
    if (collectedCoins < totalCoins) {
      setCollectedCoins((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCollectedCoins(0);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 30%, #172554 0%, #030712 100%)",
        color: "#f8fafc",
      }}
    >
      {/* 3D Viewport Placeholder / Canvas Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16 }}>{stage.thumbnail}</div>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#fbbf24",
            textShadow: "0 4px 16px rgba(0,0,0,0.8)",
            marginBottom: 8,
          }}
        >
          {stage.nameKm}
        </h2>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 20,
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            fontSize: 13,
            color: "#cbd5e1",
          }}
        >
          <span>តួអង្គកំពុងលេង៖</span>
          <strong style={{ color: "#fbbf24" }}>{character.nameKm}</strong>
        </div>
      </div>

      {/* Top HUD Bar */}
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        {/* Top-Left: Back to Stage Selection & Mission */}
        <div style={{ pointerEvents: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <Button
            size="sm"
            variant="outline"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate("/")}
          >
            ត្រឡប់ទៅកាន់ទំព័រដើម (Exit to Lobby)
          </Button>

          {/* Mission Card */}
          <div
            style={{
              padding: "12px 18px",
              borderRadius: 16,
              background: "rgba(15, 23, 42, 0.88)",
              border: "1.5px solid rgba(245, 158, 11, 0.4)",
              backdropFilter: "blur(12px)",
              maxWidth: 340,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Compass size={17} color="#f59e0b" />
              <span style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc" }}>
                {stage.nameKm}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
              {stage.descriptionKm}
            </p>
          </div>
        </div>

        {/* Top-Right: Coins, Passport, Settings */}
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Coin Counter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px",
              borderRadius: 16,
              background: "rgba(15, 23, 42, 0.9)",
              border: "1.5px solid rgba(245, 158, 11, 0.5)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
          >
            <Coins size={22} color="#fbbf24" />
            <div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>
                កាក់ប្រមូលបាន
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#fbbf24", lineHeight: 1 }}>
                {collectedCoins} <span style={{ fontSize: 12, color: "#94a3b8" }}>/ {totalCoins}</span>
              </div>
            </div>
          </div>

          {/* Passport / Guidebook Toggle */}
          <button
            onClick={() => setIsPassportOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 16,
              background: "linear-gradient(135deg, #1c2738 0%, #0f1724 100%)",
              border: "1.5px solid #d4bc8b",
              color: "#fbbf24",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
            }}
          >
            <BookOpen size={17} color="#fbbf24" />
            <span>លិខិតឆ្លងដែន (Passport)</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </header>

      {/* Bottom Floating Control / Interaction Bar */}
      <footer
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "10px 20px",
            borderRadius: 24,
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
          }}
        >
          <Button
            size="sm"
            variant="primary"
            icon={<Coins size={15} fill="#0f172a" />}
            onClick={handleCollectSimulatedCoin}
            disabled={collectedCoins >= totalCoins}
          >
            {collectedCoins >= totalCoins ? "ប្រមូលកាក់គ្រប់ហើយ!" : "សាកល្បងរើសកាក់ (+1 Coin)"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            icon={<RotateCcw size={15} />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </footer>

      {/* Diegetic Tourist Passport Modal */}
      {isPassportOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => setIsPassportOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 580,
              background: "linear-gradient(135deg, #1c2738 0%, #0f1724 100%)",
              borderRadius: 24,
              border: "3px solid #d4bc8b",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
              padding: "28px 32px",
              color: "#f8fafc",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Passport Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1.5px solid rgba(212, 188, 139, 0.3)",
                paddingBottom: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 28 }}>🇰🇭</div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fbbf24" }}>
                    លិខិតឆ្លងដែនទេសចរណ៍ (Tourist Passport)
                  </h3>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    ព្រះរាជាណាចក្រកម្ពុជា • សៀវភៅកត់ត្រាការផ្សងព្រេង
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPassportOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: 20,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Traveler Profile */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: "rgba(255, 255, 255, 0.04)",
                padding: "14px 18px",
                borderRadius: 16,
                marginBottom: 20,
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: 36 }}>{character.avatarIcon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc" }}>
                  {character.nameKm}
                </div>
                <div style={{ fontSize: 12, color: "#fbbf24" }}>{character.roleKm}</div>
              </div>
            </div>

            {/* Stamp Collection */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#d4bc8b", marginBottom: 12 }}>
                ត្រាអនុស្សាវរីយ៍ទេសចរណ៍ (Destination Stamps)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {STAGES_DATA.slice(0, 3).map((stg) => (
                  <div
                    key={stg.id}
                    style={{
                      padding: "14px 10px",
                      borderRadius: 14,
                      background: "rgba(0, 0, 0, 0.3)",
                      border: "1px dashed rgba(212, 188, 139, 0.4)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{stg.thumbnail}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc" }}>
                      {stg.nameKm.slice(0, 14)}...
                    </div>
                    <Badge variant="gold" style={{ fontSize: 10, marginTop: 6, padding: "2px 6px" }}>
                      បានមកដល់
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <Button fullWidth variant="primary" onClick={() => setIsPassportOpen(false)}>
              បិទសៀវភៅលិខិតឆ្លងដែន
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
