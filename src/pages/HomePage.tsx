import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHARACTERS_DATA, STAGES_DATA } from "../data/gameData";
import { TopGameBar } from "../components/ui/lobby/TopGameBar";
import { CharacterSlotPanel } from "../components/ui/lobby/CharacterSlotPanel";
import { CharacterShowcase } from "../components/ui/lobby/CharacterShowcase";
import { PlayGameButton } from "../components/ui/lobby/PlayGameButton";
import { StagesOverlay } from "../components/ui/lobby/StagesOverlay";
import { SettingsModal } from "../components/ui/lobby/SettingsModal";
import { GuidebookModal } from "../components/ui/lobby/GuidebookModal";

export function HomePage() {
  const navigate = useNavigate();

  // Selected Character & Stage state
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(() => {
    return localStorage.getItem("selectedCharacterId") || "khmer-male";
  });
  const [selectedStageId, setSelectedStageId] =
    useState<string>("angkor-treasure");

  // Modal overlays
  const [isStagesOpen, setIsStagesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Active character
  const activeCharacter =
    CHARACTERS_DATA.find((c) => c.id === selectedCharacterId) ||
    CHARACTERS_DATA[0];

  const handleSelectCharacter = (id: string) => {
    setSelectedCharacterId(id);
    localStorage.setItem("selectedCharacterId", id);
  };

  const handlePlayGame = () => {
    navigate(`/play?stage=${selectedStageId}&character=${selectedCharacterId}`);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 40%, #1e293b 0%, #0a0e17 80%)",
        color: "#f8fafc",
      }}
    >
      {/* 1. Top Bar: [ESC] SELECT CHARACTER & Quick Utility Icons */}
      <TopGameBar
        title="SELECT CHARACTER"
        subtitle="ជ្រើសរើសតួអង្គ"
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExit={() => alert("អរគុណសម្រាប់ការលេង! (Thank you for playing!)")}
      />

      {/* 2. Left Floating Game Panel: Region, Character Slots, Stages button */}
      <CharacterSlotPanel
        characters={CHARACTERS_DATA}
        selectedId={selectedCharacterId}
        onSelectCharacter={handleSelectCharacter}
        onViewStages={() => setIsStagesOpen(true)}
        onCreateNew={() => setIsGuideOpen(true)}
      />

      {/* 3. Center Screen: 3D Character Showcase & Atmosphere */}
      <CharacterShowcase character={activeCharacter} />

      {/* 4. Bottom Right: Epic Glowing [ PLAY ] Button */}
      <PlayGameButton onClick={handlePlayGame} />

      {/* 5. Stage / Destination Selection Overlay */}
      {isStagesOpen && (
        <StagesOverlay
          stages={STAGES_DATA}
          selectedStageId={selectedStageId}
          onSelectStage={(id) => {
            setSelectedStageId(id);
            setIsStagesOpen(false);
          }}
          onClose={() => setIsStagesOpen(false)}
        />
      )}

      {/* 6. Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}

      {/* 7. Guidebook Modal */}
      {isGuideOpen && (
        <GuidebookModal onClose={() => setIsGuideOpen(false)} />
      )}
    </div>
  );
}
