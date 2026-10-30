import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  className = "",
  style,
  disabled,
  ...rest
}: ButtonProps) {
  // Base styles
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "var(--font-km)",
    fontWeight: 700,
    borderRadius: "14px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "none",
    outline: "none",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.5 : 1,
    transform: "translateY(0)",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
  };

  // Size styles
  const sizeStyles: Record<"sm" | "md" | "lg", React.CSSProperties> = {
    sm: {
      padding: "6px 14px",
      fontSize: "13px",
      borderRadius: "10px",
    },
    md: {
      padding: "10px 22px",
      fontSize: "15px",
      borderRadius: "14px",
    },
    lg: {
      padding: "14px 30px",
      fontSize: "17px",
      borderRadius: "16px",
    },
  };

  // Variant styles
  const variantStyles: Record<
    "primary" | "secondary" | "outline" | "ghost",
    React.CSSProperties
  > = {
    primary: {
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      color: "#0f172a",
      border: "1px solid #fbbf24",
      boxShadow: "0 6px 20px rgba(245, 158, 11, 0.35)",
    },
    secondary: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#ffffff",
      border: "1px solid #34d399",
      boxShadow: "0 6px 20px rgba(16, 185, 129, 0.35)",
    },
    outline: {
      background: "rgba(15, 23, 42, 0.6)",
      color: "#f8fafc",
      border: "1.5px solid rgba(245, 158, 11, 0.5)",
      backdropFilter: "blur(8px)",
    },
    ghost: {
      background: "transparent",
      color: "#cbd5e1",
      border: "none",
      boxShadow: "none",
    },
  };

  return (
    <button
      className={`reusable-btn ${className}`}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant !== "ghost") {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && variant !== "ghost") {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
        }
      }}
      {...rest}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

