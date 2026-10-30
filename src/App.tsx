import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { CharacterSelectPage } from "./pages/CharacterSelectPage";
import { StageSelectPage } from "./pages/StageSelectPage";
import { GamePlayPage } from "./pages/GamePlayPage";
import { RotateDevicePrompt } from "./components/ui/common/RotateDevicePrompt";

export default function App() {
  return (
    <BrowserRouter>
      {/* Automatic horizontal orientation guard for mobile */}
      <RotateDevicePrompt />

      <Routes>
        {/* Main Home Game Lobby (Mobile Horizontal) */}
        <Route path="/" element={<HomePage />} />

        {/* About & Cultural Education Page */}
        <Route path="/about" element={<AboutPage />} />

        {/* Character Selection Page */}
        <Route path="/characters" element={<CharacterSelectPage />} />

        {/* Stage / Destination Selection Page */}
        <Route path="/stages" element={<StageSelectPage />} />

        {/* Active Gameplay Viewport */}
        <Route path="/play" element={<GamePlayPage />} />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
