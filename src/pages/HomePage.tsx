import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/ui/common/PageContainer";
import { Button } from "../components/ui/common/Button";
import { Card } from "../components/ui/common/Card";
import { Badge } from "../components/ui/common/Badge";
import { Play, Users, Sparkles, Compass, Shield, Award } from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      {/* Hero Section */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "48px 16px 40px",
          position: "relative",
        }}
      >
        <Badge
          variant="gold"
          icon={<Sparkles size={14} />}
          style={{ marginBottom: 18 }}
        >
          បទពិសោធន៍ទេសចរណ៍ 3D ដំបូងគេបង្អស់នៃកម្ពុជា
        </Badge>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 54px)",
            fontWeight: 900,
            lineHeight: 1.2,
            marginBottom: 16,
            background: "linear-gradient(135deg, #ffffff 0%, #fbbf24 60%, #d97706 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          ដំណើរផ្សងព្រេងអង្គរ និងដែនដីសុវណ្ណភូមិ
        </h1>

        <p
          style={{
            maxWidth: 680,
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "#94a3b8",
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          ស្វែងយល់ពីប្រាង្គប្រាសាទបុរាណ វប្បធម៌ខ្មែរ ធម្មជាតិដ៏ស្រស់បំព្រង និងការរស់នៅតាមដងទន្លេ 
          តាមរយៈការលេងហ្គេម 3D ដ៏ជក់ចិត្ត ជាមួយតួអង្គ និងយានជំនិះប្រពៃណីពិតៗ។
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            marginBottom: 48,
          }}
        >
          <Button
            size="lg"
            variant="primary"
            icon={<Play size={20} fill="#0f172a" />}
            onClick={() => navigate("/stages")}
          >
            ជ្រើសរើសវគ្គលេង (Choose Stage)
          </Button>

          <Button
            size="lg"
            variant="outline"
            icon={<Users size={20} color="#fbbf24" />}
            onClick={() => navigate("/characters")}
          >
            ជ្រើសរើសតួអង្គ (Select Avatar)
          </Button>
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            width: "100%",
            marginTop: 16,
          }}
        >
          <Card interactive onClick={() => navigate("/stages")}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏛️</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24", marginBottom: 8 }}>
              រុករកប្រាសាទបុរាណ
            </h3>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
              រុករកបរិវេណប្រាសាទអង្គរវត្ត ប្រមូលកាក់មាស និងវត្ថុបុរាណដើម្បីបើកត្រាលិខិតឆ្លងដែន។
            </p>
          </Card>

          <Card interactive onClick={() => navigate("/stages")}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🛺</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#38bdf8", marginBottom: 8 }}>
              បើកបរកង់បី និងទូក
            </h3>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
              ជិះកង់បី Tuk-Tuk តាមដងផ្លូវសៀមរាប ឬបើកទូកកម្សាន្តលើផ្ទៃទឹកបឹងទន្លេសាបដ៏ធំល្វឹងល្វើយ។
            </p>
          </Card>

          <Card interactive onClick={() => navigate("/about")}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📜</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#34d399", marginBottom: 8 }}>
              UI បែបជីវិតពិត (Diegetic)
            </h3>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
              ប្រើប្រាស់លិខិតឆ្លងដែនទេសចរណ៍ ត្រីវិស័យបុរាណ និងផែនទីក្រដាសដូចកាន់ក្នុងដៃផ្ទាល់។
            </p>
          </Card>
        </div>

        {/* Quick Stats / Trust */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 32,
            marginTop: 52,
            padding: "20px 32px",
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: 20,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Compass size={22} color="#fbbf24" />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc" }}>៥+ វគ្គកម្សាន្ត</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Angkor, Tuk-Tuk, Boat</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Shield size={22} color="#34d399" />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc" }}>វប្បធម៌ខ្មែរពិត</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Authentic Khmer Heritage</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Award size={22} color="#38bdf8" />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc" }}>លេងលើ Web ភ្លាមៗ</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>No Installation Required</div>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
