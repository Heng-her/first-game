import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { GamePlayPage } from "./pages/GamePlayPage";
import { RoadsViewerPage } from "./pages/RoadsViewerPage";
import { RotateDevicePrompt } from "./components/ui/common/RotateDevicePrompt";

export default function App() {
  return (
    <BrowserRouter>
      {/* Automatic horizontal orientation guard for mobile */}
      <RotateDevicePrompt />

      <Routes>
        {/* Main Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Active Gameplay Viewport */}
        <Route path="/play" element={<GamePlayPage />} />

        {/* 3D Roads & Props Model Viewer */}
        <Route path="/roads" element={<RoadsViewerPage />} />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
