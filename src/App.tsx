import { useState } from "react";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>("welcome");

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0e17 0%, #1a2234 100%)",
        color: "#f8fafc",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          padding: "36px 32px",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(12px)",
          borderRadius: 20,
          border: "1.5px solid rgba(245, 158, 11, 0.4)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div style={{ fontSize: 42, marginBottom: 16 }}>🏛️ 🗺️ ✨</div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#f59e0b",
            marginBottom: 12,
          }}
        >
          UI Flow Workspace — ត្រៀមរៀបចំ Flow ថ្មី
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#cbd5e1",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          កូដចាស់ត្រូវបានជម្រះ និងរក្សាទុកក្នុង Git Backup រួចរាល់។
          <br />
          ឥឡូវនេះ អ្នកអាចចាប់ផ្តើមរចនា និងសរសេរលំហូរ UI ថ្មីតាមតម្រូវការបានយ៉ាងងាយស្រួល!
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={() => setCurrentScreen("menu")}
            style={{
              padding: "10px 20px",
              background: "#f59e0b",
              color: "#0f172a",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Start (Screen: {currentScreen})
          </button>
        </div>
      </div>
    </main>
  );
}
