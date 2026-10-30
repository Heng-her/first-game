import { X, BookOpen, MapPin, Compass } from "lucide-react";
import { soundFX } from "../../../utils/audio";

export interface GuidebookModalProps {
  onClose: () => void;
}

export function GuidebookModal({ onClose }: GuidebookModalProps) {
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
          maxWidth: 620,
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BookOpen size={20} color="#fbbf24" />
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fbbf24", letterSpacing: 1 }}>
              មគ្គុទ្ទេសក៍ទេសចរណ៍ & វប្បធម៌ (TOURISM GUIDE)
            </div>
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

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 13, lineHeight: 1.7, color: "#cbd5e1" }}>
          <p>
            ស្វាគមន៍មកកាន់ <strong>ដំណើរផ្សងព្រេងអង្គរ 3D (Angkor Adventure)</strong>! នេះជាហ្គេម 3D បែបទេសចរណ៍វប្បធម៌ ដែលអនុញ្ញាតឱ្យអ្នករុករកប្រាង្គប្រាសាទបុរាណ បើកបរកង់បីតាមដងផ្លូវសៀមរាប និងជិះទូកលើបឹងទន្លេសាប។
          </p>

          <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
            <div style={{ color: "#fbbf24", fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <Compass size={15} />
              របៀបលេង (Controls):
            </div>
            <div>• ប្រើគ្រាប់ចុច <strong>W, A, S, D</strong> ឬ <strong>ព្រួញ</strong> ដើម្បីបញ្ជាទិសដៅដើរ</div>
            <div>• ចុច <strong>Shift</strong> ដើម្បីរត់លឿន (Sprint)</div>
            <div>• ចុច <strong>Space</strong> ដើម្បីលោត (Jump)</div>
          </div>

          <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <div style={{ color: "#34d399", fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={15} />
              បេសកកម្មទេសចរណ៍ (Tourism Mission):
            </div>
            <div>• ប្រមូលកាក់បុរាណ និងវត្ថុអនុស្សាវរីយ៍តាមផ្លូវដើម្បីបំពេញលិខិតឆ្លងដែនទេសចរណ៍ (Passport Stamps)។</div>
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
            }}
          >
            យល់ព្រម (Got it)
          </button>
        </div>
      </div>
    </div>
  );
}

