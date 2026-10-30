import { NavLink, Link } from "react-router-dom";
import { Compass, Users, MapPin, Info, Play } from "lucide-react";

export function Navbar() {
  const navItems = [
    { to: "/", label: "ទំព័រដើម", labelEn: "Home", icon: <Compass size={17} /> },
    { to: "/characters", label: "ជ្រើសតួអង្គ", labelEn: "Characters", icon: <Users size={17} /> },
    { to: "/stages", label: "ជ្រើសវគ្គលេង", labelEn: "Stages", icon: <MapPin size={17} /> },
    { to: "/about", label: "អំពីគម្រោង", labelEn: "About", icon: <Info size={17} /> },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "rgba(10, 14, 23, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(245, 158, 11, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg, #f59e0b, #b45309)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)",
            }}
          >
            🏛️
          </div>
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#f8fafc",
                lineHeight: 1.1,
                letterSpacing: "0.3px",
              }}
            >
              ANGKOR ADVENTURE
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#fbbf24",
                fontWeight: 700,
              }}
            >
              ដំណើរផ្សងព្រេងទេសចរណ៍ 3D
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s ease",
                background: isActive
                  ? "rgba(245, 158, 11, 0.15)"
                  : "transparent",
                color: isActive ? "#fbbf24" : "#94a3b8",
                border: isActive
                  ? "1px solid rgba(245, 158, 11, 0.4)"
                  : "1px solid transparent",
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Quick Play CTA Button */}
        <div>
          <Link
            to="/play"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#0f172a",
              fontWeight: 800,
              fontSize: 14,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(245, 158, 11, 0.4)",
              transition: "transform 0.2s ease",
            }}
          >
            <Play size={16} fill="#0f172a" />
            <span>លេងភ្លាមៗ</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
