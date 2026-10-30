import { useState, useEffect } from "react";
import { Smartphone } from "lucide-react";

export function RotateDevicePrompt() {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Don't show on home page
      if (window.location.pathname === "/") {
        setIsPortrait(false);
        return;
      }
      // Check if window is taller than wide and is in a mobile-like dimension
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth <= 768;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isPortrait || isDismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "radial-gradient(ellipse at 50% 50%, #1e293b 0%, #030712 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        textAlign: "center",
        color: "#f8fafc",
      }}
    >
      {/* Animated Rotating Phone Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(245, 158, 11, 0.15)",
          border: "2px solid rgba(245, 158, 11, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          boxShadow: "0 0 30px rgba(245, 158, 11, 0.3)",
        }}
      >
        <div style={{ animation: "rotatePhone 2.5s ease-in-out infinite" }}>
          <Smartphone size={44} color="#fbbf24" />
        </div>
      </div>

      <div
        style={{
          padding: "4px 12px",
          borderRadius: 20,
          background: "rgba(245, 158, 11, 0.2)",
          border: "1px solid rgba(245, 158, 11, 0.4)",
          fontSize: 12,
          fontWeight: 800,
          color: "#fbbf24",
          marginBottom: 14,
          letterSpacing: 1,
        }}
      >
        MOBILE HORIZONTAL MODE
      </div>

      <h2
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: "#f8fafc",
          marginBottom: 10,
          lineHeight: 1.3,
        }}
      >
        សូមបង្វិលទូរសព្ទរបស់អ្នកទៅជាទម្រង់ផ្តេក
      </h2>

      <p
        style={{
          fontSize: 14,
          color: "#94a3b8",
          maxWidth: 320,
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        Please rotate your mobile device to Landscape / Horizontal mode to enjoy the full 3D game experience.
      </p>

      <button
        onClick={() => setIsDismissed(true)}
        style={{
          padding: "8px 22px",
          borderRadius: 24,
          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          color: "#f1f5f9",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        បន្តលេងក្នុងទម្រង់នេះ (Continue anyway)
      </button>

      <style>{`
        @keyframes rotatePhone {
          0%, 10% {
            transform: rotate(0deg);
          }
          40%, 60% {
            transform: rotate(90deg);
          }
          90%, 100% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}

