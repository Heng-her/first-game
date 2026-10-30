import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export interface PageContainerProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export function PageContainer({
  children,
  showNavbar = true,
}: PageContainerProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(ellipse at 50% 0%, #17223b 0%, #0a0e17 75%)",
        color: "#f8fafc",
        overflowX: "hidden",
      }}
    >
      {showNavbar && <Navbar />}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "28px 24px 60px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </main>
    </div>
  );
}

