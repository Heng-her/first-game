import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/ui/common/PageContainer";
import { Button } from "../components/ui/common/Button";
import { Card } from "../components/ui/common/Card";
import { Badge } from "../components/ui/common/Badge";
import { STAGES_DATA } from "../data/gameData";
import { Play, Lock, Sparkles, MapPin, Clock, Award } from "lucide-react";

export function StageSelectPage() {
  const navigate = useNavigate();
  const [selectedStageId, setSelectedStageId] = useState<string>("angkor-treasure");

  const handlePlayStage = (stageId: string) => {
    navigate(`/play?stage=${stageId}`);
  };

  return (
    <PageContainer>
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Badge variant="gold" icon={<Sparkles size={14} />} style={{ marginBottom: 12 }}>
            ការជ្រើសរើសវគ្គលេង (Stage & Destination Selection)
          </Badge>
          <h1
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 900,
              color: "#fbbf24",
              marginBottom: 8,
            }}
          >
            ជ្រើសរើសទិសដៅទេសចរណ៍ និងរបៀបលេង
          </h1>
          <p style={{ fontSize: 15, color: "#94a3b8" }}>
            ជ្រើសរើសតំបន់ប្រវត្តិសាស្ត្រ ឬសកម្មភាពដែលអ្នកចង់ផ្សងព្រេងក្នុងប្រទេសកម្ពុជា។
          </p>
        </div>

        {/* Stages Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 22,
            marginBottom: 40,
          }}
        >
          {STAGES_DATA.map((stage) => {
            const isSelected = stage.id === selectedStageId;

            return (
              <Card
                key={stage.id}
                interactive={stage.isUnlocked}
                active={isSelected && stage.isUnlocked}
                onClick={() => {
                  if (stage.isUnlocked) {
                    setSelectedStageId(stage.id);
                  }
                }}
                style={{
                  opacity: stage.isUnlocked ? 1 : 0.65,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 290,
                }}
              >
                <div>
                  {/* Top Bar with Thumbnail & Status */}
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
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: stage.isUnlocked
                          ? "rgba(245, 158, 11, 0.2)"
                          : "rgba(255, 255, 255, 0.05)",
                        border: stage.isUnlocked
                          ? "1px solid rgba(245, 158, 11, 0.4)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26,
                      }}
                    >
                      {stage.thumbnail}
                    </div>

                    {stage.isUnlocked ? (
                      <Badge variant="emerald" icon={<Award size={13} />}>
                        អាចលេងបាន
                      </Badge>
                    ) : (
                      <Badge variant="gray" icon={<Lock size={13} />}>
                        ចាក់សោ (Coming Soon)
                      </Badge>
                    )}
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", marginBottom: 6 }}>
                    {stage.nameKm}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: "#fbbf24",
                      marginBottom: 12,
                    }}
                  >
                    <MapPin size={14} />
                    <span>{stage.locationKm} ({stage.locationEn})</span>
                  </div>

                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 18 }}>
                    {stage.descriptionKm}
                  </p>
                </div>

                {/* Footer Info & Action */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: 12,
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      marginBottom: 14,
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={13} />
                      <span>{stage.durationKm}</span>
                    </div>
                    <span>{stage.difficultyKm}</span>
                  </div>

                  {stage.isUnlocked ? (
                    <Button
                      fullWidth
                      variant={isSelected ? "primary" : "outline"}
                      icon={<Play size={16} fill={isSelected ? "#0f172a" : "none"} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayStage(stage.id);
                      }}
                    >
                      ចូលលេងវគ្គនេះ (Play Stage)
                    </Button>
                  ) : (
                    <Button fullWidth variant="ghost" disabled icon={<Lock size={16} />}>
                      មិនទាន់បើកដំណើរការ
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}

