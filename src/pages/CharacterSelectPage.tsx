import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/ui/common/PageContainer";
import { Button } from "../components/ui/common/Button";
import { Card } from "../components/ui/common/Card";
import { Badge } from "../components/ui/common/Badge";
import { CHARACTERS_DATA } from "../data/gameData";
import { Check, ArrowRight, Sparkles } from "lucide-react";

export function CharacterSelectPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>("khmer-male");

  const selectedChar =
    CHARACTERS_DATA.find((c) => c.id === selectedId) || CHARACTERS_DATA[0];

  const handleConfirmAndProceed = () => {
    // Save to localStorage or state
    localStorage.setItem("selectedCharacterId", selectedId);
    navigate("/stages");
  };

  return (
    <PageContainer>
      <div style={{ maxWidth: 1040, margin: "0 auto", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Badge variant="gold" icon={<Sparkles size={14} />} style={{ marginBottom: 12 }}>
            ការជ្រើសរើសតួអង្គ (Character Selection)
          </Badge>
          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 900,
              color: "#fbbf24",
              marginBottom: 8,
            }}
          >
            ជ្រើសរើសតួអង្គសម្រាប់ការផ្សងព្រេង
          </h1>
          <p style={{ fontSize: 15, color: "#94a3b8" }}>
            ជ្រើសរើសតួអង្គដែលអ្នកពេញចិត្ត ដើម្បីរុករកប្រាសាទបុរាណ និងតំបន់ទេសចរណ៍នានា។
          </p>
        </div>

        {/* Character Selection Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 36,
          }}
        >
          {CHARACTERS_DATA.map((char) => {
            const isSelected = char.id === selectedId;

            return (
              <Card
                key={char.id}
                interactive
                active={isSelected}
                onClick={() => setSelectedId(char.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 280,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 16,
                        background: isSelected
                          ? "linear-gradient(135deg, #f59e0b, #b45309)"
                          : "rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        boxShadow: isSelected
                          ? "0 4px 16px rgba(245, 158, 11, 0.4)"
                          : "none",
                      }}
                    >
                      {char.avatarIcon}
                    </div>

                    {isSelected && (
                      <Badge variant="gold" icon={<Check size={14} />}>
                        បានជ្រើសរើស
                      </Badge>
                    )}
                  </div>

                  <h3 style={{ fontSize: 19, fontWeight: 800, color: "#f8fafc", marginBottom: 4 }}>
                    {char.nameKm}
                  </h3>
                  <div style={{ fontSize: 12, color: "#fbbf24", fontWeight: 700, marginBottom: 12 }}>
                    {char.roleKm}
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 16 }}>
                    {char.descriptionKm}
                  </p>
                </div>

                {/* Features Tags */}
                <div>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>
                    លក្ខណៈពិសេស៖
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {char.features.map((feat, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: 11,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "rgba(255, 255, 255, 0.06)",
                          color: "#cbd5e1",
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Confirmation Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            padding: "20px 28px",
            background: "rgba(15, 23, 42, 0.9)",
            borderRadius: 20,
            border: "1.5px solid rgba(245, 158, 11, 0.4)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(245, 158, 11, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              {selectedChar.avatarIcon}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc" }}>
                តួអង្គបច្ចុប្បន្ន៖ <span style={{ color: "#fbbf24" }}>{selectedChar.nameKm}</span>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {selectedChar.roleKm} ({selectedChar.nameEn})
              </div>
            </div>
          </div>

          <Button
            size="lg"
            variant="primary"
            icon={<ArrowRight size={18} />}
            onClick={handleConfirmAndProceed}
          >
            បន្តទៅកាន់ការជ្រើសរើសវគ្គ (Choose Stage)
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
