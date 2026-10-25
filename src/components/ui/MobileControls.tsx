import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, ChevronUp } from 'lucide-react';
import type { PlayerControls } from '../../types/game';

interface MobileControlsProps {
  onControlChange: (key: keyof PlayerControls, value: boolean) => void;
  isRunning: boolean;
}

export function MobileControls({ onControlChange, isRunning }: MobileControlsProps) {
  const handleTouch = (key: keyof PlayerControls, isPress: boolean) => (e: React.SyntheticEvent) => {
    e.preventDefault();
    onControlChange(key, isPress);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 24px',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* Directional D-Pad */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 56px)',
          gridTemplateRows: 'repeat(3, 56px)',
          gap: 6,
          pointerEvents: 'auto',
        }}
      >
        <div />
        <button
          className="glass-panel"
          style={{
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            touchAction: 'none',
          }}
          onMouseDown={handleTouch('forward', true)}
          onMouseUp={handleTouch('forward', false)}
          onTouchStart={handleTouch('forward', true)}
          onTouchEnd={handleTouch('forward', false)}
          aria-label="ដើរទៅមុខ (Forward)"
        >
          <ArrowUp size={28} />
        </button>
        <div />

        <button
          className="glass-panel"
          style={{
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            touchAction: 'none',
          }}
          onMouseDown={handleTouch('left', true)}
          onMouseUp={handleTouch('left', false)}
          onTouchStart={handleTouch('left', true)}
          onTouchEnd={handleTouch('left', false)}
          aria-label="បត់ឆ្វេង (Turn Left)"
        >
          <ArrowLeft size={28} />
        </button>
        <div />
        <button
          className="glass-panel"
          style={{
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            touchAction: 'none',
          }}
          onMouseDown={handleTouch('right', true)}
          onMouseUp={handleTouch('right', false)}
          onTouchStart={handleTouch('right', true)}
          onTouchEnd={handleTouch('right', false)}
          aria-label="បត់ស្តាំ (Turn Right)"
        >
          <ArrowRight size={28} />
        </button>

        <div />
        <button
          className="glass-panel"
          style={{
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            touchAction: 'none',
          }}
          onMouseDown={handleTouch('backward', true)}
          onMouseUp={handleTouch('backward', false)}
          onTouchStart={handleTouch('backward', true)}
          onTouchEnd={handleTouch('backward', false)}
          aria-label="ថយក្រោយ (Backward)"
        >
          <ArrowDown size={28} />
        </button>
        <div />
      </div>

      {/* Action Buttons: Jump & Sprint */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          justifyContent: 'flex-end',
          pointerEvents: 'auto',
        }}
      >
        {/* Sprint Toggle/Hold */}
        <button
          className="glass-panel"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: isRunning ? '#f59e0b' : '#fff',
            border: isRunning ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            touchAction: 'none',
            fontSize: 11,
          }}
          onMouseDown={handleTouch('run', true)}
          onMouseUp={handleTouch('run', false)}
          onTouchStart={handleTouch('run', true)}
          onTouchEnd={handleTouch('run', false)}
          aria-label="រត់ (Sprint)"
        >
          <Zap size={22} />
          <span>រត់</span>
        </button>

        {/* Jump Button */}
        <button
          className="glass-panel"
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            background: 'rgba(245, 158, 11, 0.25)',
            border: '2px solid #f59e0b',
            cursor: 'pointer',
            touchAction: 'none',
            fontSize: 12,
            fontWeight: 'bold',
          }}
          onMouseDown={handleTouch('jump', true)}
          onMouseUp={handleTouch('jump', false)}
          onTouchStart={handleTouch('jump', true)}
          onTouchEnd={handleTouch('jump', false)}
          aria-label="លោត (Jump)"
        >
          <ChevronUp size={28} />
          <span>លោត</span>
        </button>
      </div>
    </div>
  );
}
