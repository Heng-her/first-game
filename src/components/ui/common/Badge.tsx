import type { HTMLAttributes, ReactNode } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "gold" | "emerald" | "blue" | "gray";
  icon?: ReactNode;
}

export function Badge({
  children,
  variant = "gold",
  icon,
  className = "",
  style,
  ...rest
}: BadgeProps) {
  const variantStyles: Record<"gold" | "emerald" | "blue" | "gray", React.CSSProperties> = {
    gold: {
      background: "rgba(245, 158, 11, 0.15)",
      border: "1px solid rgba(245, 158, 11, 0.4)",
      color: "#fbbf24",
    },
    emerald: {
      background: "rgba(16, 185, 129, 0.15)",
      border: "1px solid rgba(16, 185, 129, 0.4)",
      color: "#34d399",
    },
    blue: {
      background: "rgba(6, 182, 212, 0.15)",
      border: "1px solid rgba(6, 182, 212, 0.4)",
      color: "#38bdf8",
    },
    gray: {
      background: "rgba(148, 163, 184, 0.12)",
      border: "1px solid rgba(148, 163, 184, 0.3)",
      color: "#cbd5e1",
    },
  };

  return (
    <span
      className={`reusable-badge ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.2px",
        ...variantStyles[variant],
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
