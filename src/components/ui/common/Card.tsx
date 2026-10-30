import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  active?: boolean;
  variant?: "glass" | "parchment" | "subtle";
}

export function Card({
  children,
  interactive = false,
  active = false,
  variant = "glass",
  className = "",
  style,
  ...rest
}: CardProps) {
  const baseStyle: React.CSSProperties = {
    borderRadius: "18px",
    padding: "20px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: interactive ? "pointer" : "default",
    position: "relative",
    overflow: "hidden",
  };

  const variantStyles: Record<"glass" | "parchment" | "subtle", React.CSSProperties> = {
    glass: {
      background: active
        ? "linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))"
        : "rgba(15, 23, 42, 0.8)",
      border: active
        ? "2px solid #f59e0b"
        : "1px solid rgba(255, 255, 255, 0.12)",
      boxShadow: active
        ? "0 10px 30px rgba(245, 158, 11, 0.25)"
        : "0 8px 24px rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(12px)",
      color: "#f8fafc",
    },
    parchment: {
      background: "linear-gradient(135deg, #fdf6e2 0%, #f4e8c1 100%)",
      border: "1.5px solid #d4bc8b",
      boxShadow: "0 8px 24px rgba(69, 43, 18, 0.2)",
      color: "#1e293b",
    },
    subtle: {
      background: "rgba(255, 255, 255, 0.04)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      color: "#cbd5e1",
    },
  };

  return (
    <div
      className={`reusable-card ${className}`}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (interactive) {
          e.currentTarget.style.transform = "translateY(-4px)";
          if (!active) {
            e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.6)";
            e.currentTarget.style.boxShadow = "0 14px 32px rgba(0, 0, 0, 0.6)";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (interactive) {
          e.currentTarget.style.transform = "translateY(0)";
          if (!active) {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.4)";
          }
        }
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
