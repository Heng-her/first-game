import { PageContainer } from "../components/ui/common/PageContainer";
import { Card } from "../components/ui/common/Card";
import { Badge } from "../components/ui/common/Badge";
import { BookOpen, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

export function AboutPage() {
  return (
    <PageContainer>
      <div style={{ maxWidth: 860, margin: "0 auto", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Badge variant="gold" icon={<Sparkles size={14} />} style={{ marginBottom: 12 }}>
            អំពីគម្រោង (About Project)
          </Badge>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 900,
              color: "#fbbf24",
              marginBottom: 12,
            }}
          >
            បេសកកម្មទេសចរណ៍ និងវប្បធម៌ខ្មែរ
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7 }}>
            ហ្គេម 3D នេះត្រូវបានបង្កើតឡើងក្នុងគោលបំណងលើកកម្ពស់ទេសចរណ៍កម្ពុជា 
            បង្ហាញពីប្រាសាទបុរាណ វប្បធម៌ និងរបៀបរស់នៅប្រចាំថ្ងៃ តាមរយៈការលេងហ្គេមបែបអន្តរកម្ម។
          </p>
        </div>

        {/* Content Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Card 1: Core Mission */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <BookOpen size={24} color="#fbbf24" />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>
                គោលបំណងសំខាន់ (Our Mission)
              </h2>
            </div>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, marginBottom: 16 }}>
              យើងចង់ផ្តល់នូវបទពិសោធន៍ដែលអ្នកលេងមិនត្រឹមតែលេងកម្សាន្តប៉ុណ្ណោះទេ ប៉ុន្តែថែមទាំងទទួលបានចំណេះដឹងពិតៗអំពី៖
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              {[
                "ប្រវត្តិប្រាសាទអង្គរវត្ត និងស្ថាបត្យកម្មបុរាណខ្មែរ",
                "យានជំនិះប្រពៃណីកង់បី (Tuk-Tuk/Remork) នៃខេត្តសៀមរាប",
                "ជីវភាពរស់នៅលើផ្ទៃទឹកនៃបឹងទន្លេសាប",
                "ធម្មជាតិ និងប្រភពទឹកពិសិដ្ឋនៃភ្នំគូលែន",
                "ម្ហូបប្រពៃណីខ្មែរ ដូចជា អាម៉ុកត្រី និងសម្លការី",
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 4 }} />
                  <span style={{ fontSize: 13, color: "#cbd5e1" }}>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 2: Diegetic UI Experience */}
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <MapPin size={24} color="#38bdf8" />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc" }}>
                ការរចនា UI បែបរូបរាងជីវិតពិត (Diegetic Skeuomorphic UI)
              </h2>
            </div>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8 }}>
              ហ្គេមនេះជៀសវាងផ្ទាំង UI រាបស្មើធម្មតា ដោយជំនួសមកវិញនូវវត្ថុដែលអ្នកទេសចរប្រើប្រាស់ជាក់ស្តែង៖
              <br />
              • <strong>សៀវភៅលិខិតឆ្លងដែន (Tourist Passport):</strong> សម្រាប់ប្រមូលត្រាអនុស្សាវរីយ៍តាមតំបន់នីមួយៗ។
              <br />
              • <strong>ត្រីវិស័យបុរាណ (Brass Compass):</strong> ធ្វើពីលង្ហិន ចង្អុលទិសដៅពិតតាមការបង្វិលកាមេរ៉ា។
              <br />
              • <strong>ផែនទីក្រដាសចាស់ (Vintage Paper Map):</strong> សម្រាប់បង្ហាញផ្លូវ និងទីតាំងសំខាន់ៗ។
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
