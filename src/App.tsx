import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { CharacterSelectPage } from "./pages/CharacterSelectPage";
import { StageSelectPage } from "./pages/StageSelectPage";
import { GamePlayPage } from "./pages/GamePlayPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Home Page */}
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
