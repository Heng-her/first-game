import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/common/Button";
import { Badge } from "../components/ui/common/Badge";
import { soundFX } from "../utils/audio";
import { Play, Sparkles } from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        margin: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "radial-gradient(ellipse at 50% 35%, #0f172a 0%, #020617 100%)",
        color: "#f8fafc",
        fontFamily: "var(--font-km)",
        padding:
          "max(16px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left))",
      }}
    >
      {/* 1. HERO TAG */}
      <div style={{ marginBottom: "clamp(8px, 2.5vh, 20px)" }}>
        <Badge variant="gold">
          <Sparkles size={14} style={{ marginRight: 6 }} />
          ហ្គេមផ្សងព្រេងទេសចរណ៍កម្ពុជា 3D
        </Badge>
      </div>

      {/* 2. HERO HEADING & SUBTITLE */}
      <div style={{ maxWidth: 780, marginBottom: "clamp(14px, 3.5vh, 32px)", padding: "0 8px" }}>
        <h1
          style={{
            fontSize: "clamp(26px, 5.2vw, 54px)",
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: "clamp(8px, 1.8vh, 16px)",
            background: "linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #d97706 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          រុករកវប្បធម៌ និងតំបន់ទេសចរណ៍ 3D
        </h1>
        <p
          style={{
            fontSize: "clamp(14px, 2.2vw, 17px)",
            color: "#94a3b8",
            lineHeight: 1.5,
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          ស្វែងយល់ពីប្រាសាទបុរាណ ធម្មជាតិ បរិស្ថាន និងការបើកបរកង់បី (Tuk-Tuk) កាត់ក្រុងសៀមរាប
          តាមរយៈបទពិសោធន៍ហ្គេម 3D អន្តរកម្មលើ Browser។
        </p>
      </div>

      {/* 3. HERO PRIMARY ACTION (Play Adventure -> /roads) */}
      <Button
        size="lg"
        variant="primary"
        icon={<Play size={20} />}
        onClick={() => {
          soundFX.playClick();
          navigate("/roads");
        }}
        style={{
          minWidth: "clamp(200px, 35vw, 240px)",
          height: "clamp(46px, 6vh, 52px)",
          fontSize: "clamp(15px, 2vw, 17px)",
          fontWeight: 700,
          boxShadow: "0 8px 25px rgba(245, 158, 11, 0.35)",
        }}
      >
        ចាប់ផ្តើមលេង (Play Adventure)
      </Button>
    </div>
  );
}
