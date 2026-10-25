import { useState } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  Users,
  ChevronDown,
  Gauge,
  X,
  Smile,
  Shield,
  Laptop,
  Briefcase,
  Award,
  Zap,
} from 'lucide-react';
import { GOBKIT_CHARACTERS } from '../../constants/characters';

interface AnimationTestUIProps {
  selectedModel: string;
  onSelectModel: (path: string) => void;
  activeEmote: string | null;
  onPlayEmote: (animationName: string | null) => void;
  availableAnimations: string[];
  animationSpeed: number;
  onChangeSpeed: (speed: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function AnimationTestUI({
  selectedModel,
  onSelectModel,
  activeEmote,
  onPlayEmote,
  availableAnimations,
  animationSpeed,
  onChangeSpeed,
  isOpen,
  onToggleOpen,
}: AnimationTestUIProps) {
  const [characterMenuOpen, setCharacterMenuOpen] = useState(false);

  const currentCharacter =
    GOBKIT_CHARACTERS.find((c) => c.path === selectedModel) || GOBKIT_CHARACTERS[0];

  // Common quick animation categories
  const coreActions = ['Idle', 'Walk', 'Run', 'Attack', 'Hit', 'Special', 'Death'];
  
  // Extra expressive clips (Gobkit provides 20+ clips like Wave, Cheer, Bow, etc.)
  const emoteActions = availableAnimations.filter(
    (name) => !coreActions.some((c) => c.toLowerCase() === name.toLowerCase())
  );

  return (
    <>
      {/* Floating Toggle Button (Always visible on bottom right) */}
      <button
        onClick={onToggleOpen}
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          padding: '12px 18px',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#fff',
          cursor: 'pointer',
          zIndex: 30,
          background: isOpen ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 24, 40, 0.85)',
          border: '1px solid rgba(245, 158, 11, 0.6)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          fontWeight: 600,
          fontSize: 13,
        }}
        title="បើក/បិទ ផ្ទាំងតេស្ត Animation & Characters"
      >
        <Sparkles size={18} color="#f59e0b" className="animate-float" />
        <span>តេស្ត Animation (Gobkit UI)</span>
        {activeEmote && (
          <span
            style={{
              background: '#10b981',
              color: '#000',
              padding: '2px 8px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {activeEmote}
          </span>
        )}
      </button>

      {/* Main Animation & Character Testing Window */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            bottom: 80,
            right: 24,
            width: 380,
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: '75vh',
            borderRadius: 20,
            padding: 20,
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            overflowY: 'auto',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b',
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                  Animation Showcase & Testing
                </h3>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  ម៉ូដែល 3D CC0 ពី gobkit.com/freebies
                </span>
              </div>
            </div>
            <button
              onClick={onToggleOpen}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cbd5e1',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Section 1: Character Selector */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 6,
              }}
            >
              <Users size={14} color="#f59e0b" />
              ជ្រើសរើសតួអង្គ (8 Gobkit Characters):
            </label>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setCharacterMenuOpen(!characterMenuOpen)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {currentCharacter.id === 'fast-runner-fbx' && <Zap size={16} color="#eab308" />}
                  {currentCharacter.id === 'security-guard' && <Shield size={16} color="#38bdf8" />}
                  {currentCharacter.id === 'it-engineer' && <Laptop size={16} color="#34d399" />}
                  {currentCharacter.id === 'company-ceo' && <Award size={16} color="#fbbf24" />}
                  {currentCharacter.id !== 'fast-runner-fbx' &&
                    currentCharacter.id !== 'security-guard' &&
                    currentCharacter.id !== 'it-engineer' &&
                    currentCharacter.id !== 'company-ceo' && <Briefcase size={16} color="#a78bfa" />}
                  <span>{currentCharacter.nameKm} ({currentCharacter.name})</span>
                </div>
                <ChevronDown size={16} />
              </button>

              {/* Quick Switch Button for Fast-Run.fbx */}
              {selectedModel !== '/models/test/Fast-Run.fbx' ? (
                <button
                  onClick={() => onSelectModel('/models/test/Fast-Run.fbx')}
                  style={{
                    marginTop: 8,
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(245, 158, 11, 0.1))',
                    border: '1px solid rgba(234, 179, 8, 0.5)',
                    color: '#fbbf24',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <Zap size={15} />
                  <span>⚡ សាកល្បងតួអង្គ FBX: Fast-Run.fbx</span>
                </button>
              ) : (
                <div
                  style={{
                    marginTop: 8,
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    fontSize: 11.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Zap size={14} />
                  <span>កំពុងលេងតួអង្គ Mixamo ជាមួយចលនា Fast Run ពី FBX!</span>
                </div>
              )}

              {characterMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 6,
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 12,
                    boxShadow: '0 12px 30px rgba(0,0,0,0.8)',
                    maxHeight: 200,
                    overflowY: 'auto',
                    zIndex: 50,
                  }}
                >
                  {GOBKIT_CHARACTERS.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        onSelectModel(char.path);
                        setCharacterMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: selectedModel === char.path ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        color: selectedModel === char.path ? '#fbbf24' : '#e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: 12.5,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>
                        {char.nameKm} — {char.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{char.descriptionKm}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Core Animations (Idle, Walk, Run, Attack, Special) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Play size={14} color="#f59e0b" /> ចលនាសំខាន់ៗ (Core Animations):
              </label>

              {activeEmote && (
                <button
                  onClick={() => onPlayEmote(null)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    borderRadius: 6,
                    padding: '2px 8px',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={12} /> បញ្ឈប់ / Idle
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {coreActions.map((action) => {
                const isSelected = activeEmote?.toLowerCase() === action.toLowerCase();
                return (
                  <button
                    key={action}
                    onClick={() => onPlayEmote(isSelected ? null : action)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      background: isSelected
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : 'rgba(255, 255, 255, 0.06)',
                      border: isSelected
                        ? '1px solid #fbbf24'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isSelected ? '#000' : '#f8fafc',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{action}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Gestures / Expressive Emotes */}
          {emoteActions.length > 0 && (
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <Smile size={14} color="#f59e0b" /> កាយវិការបន្ថែម (Special Emotes & Gestures):
              </label>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  maxHeight: 120,
                  overflowY: 'auto',
                  paddingRight: 4,
                }}
              >
                {emoteActions.map((emote) => {
                  const isSelected = activeEmote?.toLowerCase() === emote.toLowerCase();
                  return (
                    <button
                      key={emote}
                      onClick={() => onPlayEmote(isSelected ? null : emote)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: isSelected
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected
                          ? '1px solid #34d399'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#000' : '#cbd5e1',
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {emote}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: Speed Slider */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 12,
              padding: 12,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Gauge size={14} color="#38bdf8" /> ល្បឿន Animation (Playback Speed):
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>
                {animationSpeed.toFixed(1)}x
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0.5, 1.0, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  style={{
                    flex: 1,
                    padding: '4px 0',
                    borderRadius: 6,
                    background: animationSpeed === s ? '#0284c7' : 'rgba(255,255,255,0.06)',
                    border: 'none',
                    color: '#fff',
                    fontSize: 11,
                    cursor: 'pointer',
                    fontWeight: animationSpeed === s ? 700 : 400,
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
