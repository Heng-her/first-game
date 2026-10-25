import { Compass, RotateCcw, Video, Coins, User } from 'lucide-react';
import type { PlayerState } from '../../types/game';

interface GameHUDProps {
  playerState: PlayerState;
  collectedCount: number;
  totalCoins: number;
  cameraMode: 'follow' | 'orbit';
  onToggleCamera: () => void;
  onResetPosition: () => void;
  selectedModel?: string;
  onSelectModel?: (model: string) => void;
}

export function GameHUD({
  playerState,
  collectedCount,
  totalCoins,
  cameraMode,
  onToggleCamera,
  onResetPosition,
  selectedModel,
  onSelectModel,
}: GameHUDProps) {
  const isAllCollected = collectedCount >= totalCoins && totalCoins > 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 20px',
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Left: Quest & Title */}
        <div
          className="glass-panel"
          style={{
            padding: '12px 18px',
            borderRadius: 16,
            pointerEvents: 'auto',
            maxWidth: 420,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Compass size={20} color="#f59e0b" />
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#f8fafc' }}>
              ដំណើរផ្សងព្រេងអង្គរ (Angkor Adventure)
            </h1>
          </div>
          <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0 }}>
            {isAllCollected
              ? '🎉 អបអរសាទរ! អ្នកបានប្រមូលកាក់មាសទាំងអស់ជោគជ័យ!'
              : 'បេសកកម្ម៖ ដើររុករកបរិស្ថាន និងប្រមូលកាក់បុរាណឱ្យបានគ្រប់ចំនួន។'}
          </p>
        </div>

        {/* Right: Coins Counter & Controls Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            pointerEvents: 'auto',
          }}
        >
          {/* Coin Counter */}
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 16,
              border: isAllCollected ? '1px solid #10b981' : '1px solid rgba(245, 158, 11, 0.4)',
              background: isAllCollected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 24, 40, 0.75)',
            }}
          >
            <Coins size={22} color="#fbbf24" className="animate-float" />
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>កាក់ប្រមូលបាន</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
                {collectedCount} / {totalCoins}
              </div>
            </div>
          </div>


          {/* Character Model Switcher */}
          {onSelectModel && (
            <button
              onClick={() =>
                onSelectModel(
                  selectedModel === '/models/characters/new.glb'
                    ? '/models/characters/MenKhStyle.glb'
                    : '/models/characters/new.glb'
                )
              }
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 14px',
                borderRadius: 14,
                color: '#cbd5e1',
                fontSize: 12,
                cursor: 'pointer',
              }}
              title="ប្ដូរម៉ូដែលតួអង្គ (New vs MenKhStyle)"
            >
              <User size={16} color="#38bdf8" />
              <span>
                {selectedModel === '/models/characters/MenKhStyle.glb'
                  ? 'MenKhStyle'
                  : 'New Model'}
              </span>
            </button>
          )}

          {/* Toggle Camera Button */}
          <button
            onClick={onToggleCamera}
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 14px',
              borderRadius: 14,
              color: '#cbd5e1',
              fontSize: 12,
              cursor: 'pointer',
            }}
            title="ប្ដូរទិដ្ឋភាពកាមេរ៉ា"
          >
            <Video size={16} />
            <span>{cameraMode === 'follow' ? 'Follow Cam' : 'Free Cam'}</span>
          </button>

          {/* Reset Position Button */}
          <button
            onClick={onResetPosition}
            className="glass-panel"
            style={{
              padding: '10px 12px',
              borderRadius: 14,
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="កំណត់ទីតាំងតួអង្គឡើងវិញ"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* Bottom Controls Legend (Desktop) */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 12,
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '10px 16px',
            borderRadius: 14,
            fontSize: 12,
            color: '#cbd5e1',
            pointerEvents: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <kbd style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>W A S D</kbd>
            <span>ដើរ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <kbd style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>Shift</kbd>
            <span>រត់លឿន</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <kbd style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>Space</kbd>
            <span>លោត</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b' }}>
            <span>ល្បឿន៖ {playerState.isRunning ? 'កំពុងរត់ ⚡' : playerState.isMoving ? 'កំពុងដើរ 🚶' : 'ឈប់សម្រាក 🧍'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
