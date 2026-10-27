import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Zap, ChevronUp } from 'lucide-react';
import type { PlayerControls } from '../../types/game';

interface MobileControlsProps {
  onControlChange: <K extends keyof PlayerControls>(
    key: K,
    value: PlayerControls[K]
  ) => void;
  isRunning: boolean;
}

const JOYSTICK_BASE_SIZE = 136; // px
const KNOB_SIZE = 56; // px
const MAX_RADIUS = 44; // max travel distance in px
const DEADZONE = 0.08; // 8% deadzone

export function MobileControls({
  onControlChange,
  isRunning,
}: MobileControlsProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const isMouseDraggingRef = useRef<boolean>(false);

  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState<boolean>(false);

  // Update joystick movement and fire control events
  const updateJoystick = useCallback(
    (clientX: number, clientY: number) => {
      if (!baseRef.current) return;
      const rect = baseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.hypot(dx, dy);

      if (distance === 0) {
        setKnobPos({ x: 0, y: 0 });
        onControlChange('moveVector', { x: 0, y: 0 });
        onControlChange('forward', false);
        onControlChange('backward', false);
        onControlChange('left', false);
        onControlChange('right', false);
        return;
      }

      const clampedDist = Math.min(distance, MAX_RADIUS);
      const angle = Math.atan2(dy, dx);

      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;

      setKnobPos({ x: knobX, y: knobY });

      const normDist = clampedDist / MAX_RADIUS;
      if (normDist < DEADZONE) {
        onControlChange('moveVector', { x: 0, y: 0 });
        onControlChange('forward', false);
        onControlChange('backward', false);
        onControlChange('left', false);
        onControlChange('right', false);
        return;
      }

      // Normalized coordinates (-1 to 1)
      const normX = knobX / MAX_RADIUS;
      const normY = knobY / MAX_RADIUS;

      onControlChange('moveVector', { x: normX, y: normY });

      // Thresholds for discrete direction compatibility
      onControlChange('forward', normY < -0.32);
      onControlChange('backward', normY > 0.32);
      onControlChange('left', normX < -0.32);
      onControlChange('right', normX > 0.32);
    },
    [onControlChange]
  );

  // Reset joystick back to center smoothly
  const resetJoystick = useCallback(() => {
    setIsActive(false);
    touchIdRef.current = null;
    isMouseDraggingRef.current = false;
    setKnobPos({ x: 0, y: 0 });

    onControlChange('moveVector', { x: 0, y: 0 });
    onControlChange('forward', false);
    onControlChange('backward', false);
    onControlChange('left', false);
    onControlChange('right', false);
  }, [onControlChange]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (touchIdRef.current !== null) return; // already tracking a touch

    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsActive(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  // Mouse handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isMouseDraggingRef.current = true;
    setIsActive(true);
    updateJoystick(e.clientX, e.clientY);
  };

  // Global move & release listeners during active drag
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          updateJoystick(
            e.changedTouches[i].clientX,
            e.changedTouches[i].clientY
          );
          break;
        }
      }
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          resetJoystick();
          break;
        }
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isMouseDraggingRef.current) return;
      updateJoystick(e.clientX, e.clientY);
    };

    const handleGlobalMouseUp = () => {
      if (isMouseDraggingRef.current) {
        resetJoystick();
      }
    };

    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    window.addEventListener('touchend', handleGlobalTouchEnd);
    window.addEventListener('touchcancel', handleGlobalTouchEnd);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
      window.removeEventListener('touchcancel', handleGlobalTouchEnd);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [updateJoystick, resetJoystick]);

  // Action button touch helpers
  const handleButtonAction =
    (key: keyof PlayerControls, isPress: boolean) =>
    (e: React.SyntheticEvent) => {
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
        alignItems: 'flex-end',
        padding: '0 24px',
        pointerEvents: 'none',
        zIndex: 25,
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* 360-Degree Circular Virtual Joystick */}
      <div
        ref={baseRef}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        style={{
          width: JOYSTICK_BASE_SIZE,
          height: JOYSTICK_BASE_SIZE,
          borderRadius: '50%',
          position: 'relative',
          pointerEvents: 'auto',
          touchAction: 'none',
          cursor: 'grab',
          background: isActive
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)'
            : 'radial-gradient(circle, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.82) 100%)',
          border: isActive
            ? '2px solid rgba(245, 158, 11, 0.85)'
            : '2px solid rgba(255, 255, 255, 0.22)',
          boxShadow: isActive
            ? '0 0 28px rgba(245, 158, 11, 0.45), inset 0 0 20px rgba(245, 158, 11, 0.2)'
            : '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 0 10px rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
        aria-label="ចង្កូតចលនា 360 ដឺក្រេ (360° Circular Joystick)"
      >
        {/* Subtle Directional Compass Indicators */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: knobPos.y < -15 ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)',
            boxShadow: knobPos.y < -15 ? '0 0 8px #fbbf24' : 'none',
            transition: 'background-color 0.1s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: knobPos.y > 15 ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)',
            boxShadow: knobPos.y > 15 ? '0 0 8px #fbbf24' : 'none',
            transition: 'background-color 0.1s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: knobPos.x < -15 ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)',
            boxShadow: knobPos.x < -15 ? '0 0 8px #fbbf24' : 'none',
            transition: 'background-color 0.1s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: knobPos.x > 15 ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)',
            boxShadow: knobPos.x > 15 ? '0 0 8px #fbbf24' : 'none',
            transition: 'background-color 0.1s ease',
          }}
        />

        {/* Inner Deadzone / Ring Markings */}
        <div
          style={{
            position: 'absolute',
            width: 76,
            height: 76,
            borderRadius: '50%',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            pointerEvents: 'none',
          }}
        />

        {/* Movable Inner Circular Thumbstick Knob */}
        <div
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: '50%',
            position: 'absolute',
            top: `calc(50% - ${KNOB_SIZE / 2}px)`,
            left: `calc(50% - ${KNOB_SIZE / 2}px)`,
            transform: `translate3d(${knobPos.x}px, ${knobPos.y}px, 0)`,
            transition: isActive ? 'none' : 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)',
            background: isActive
              ? 'radial-gradient(circle at 35% 35%, #fef08a 0%, #fbbf24 45%, #d97706 80%, #78350f 100%)'
              : 'radial-gradient(circle at 35% 35%, #fbbf24 0%, #d97706 70%, #92400e 100%)',
            border: '2px solid rgba(254, 240, 138, 0.8)',
            boxShadow: isActive
              ? '0 4px 22px rgba(245, 158, 11, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.8)'
              : '0 4px 14px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isActive ? 'grabbing' : 'grab',
          }}
        >
          {/* Thumbstick Center Texture Gripper */}
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
            }}
          />
        </div>
      </div>

      {/* Action Buttons: Jump & Sprint */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          justifyContent: 'flex-end',
          alignItems: 'center',
          pointerEvents: 'auto',
        }}
      >
        {/* Sprint / Run Button */}
        <button
          className="glass-panel"
          style={{
            width: 62,
            height: 62,
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: isRunning ? '#f59e0b' : '#fff',
            border: isRunning
              ? '2px solid #f59e0b'
              : '1.5px solid rgba(255,255,255,0.25)',
            boxShadow: isRunning
              ? '0 0 16px rgba(245, 158, 11, 0.5)'
              : '0 4px 14px rgba(0, 0, 0, 0.35)',
            cursor: 'pointer',
            touchAction: 'none',
            fontSize: 11,
            fontWeight: 600,
            transition: 'all 0.15s ease',
          }}
          onMouseDown={handleButtonAction('run', true)}
          onMouseUp={handleButtonAction('run', false)}
          onTouchStart={handleButtonAction('run', true)}
          onTouchEnd={handleButtonAction('run', false)}
          aria-label="រត់លឿន (Sprint)"
        >
          <Zap size={22} color={isRunning ? '#f59e0b' : '#fbbf24'} />
          <span style={{ marginTop: 2, fontSize: 10 }}>រត់</span>
        </button>

        {/* Jump Button */}
        <button
          className="glass-panel"
          style={{
            width: 74,
            height: 74,
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            background:
              'radial-gradient(circle at 35% 35%, rgba(245, 158, 11, 0.4) 0%, rgba(180, 83, 9, 0.6) 100%)',
            border: '2px solid #f59e0b',
            boxShadow: '0 4px 18px rgba(245, 158, 11, 0.45)',
            cursor: 'pointer',
            touchAction: 'none',
            fontSize: 12,
            fontWeight: 700,
            transition: 'all 0.15s ease',
          }}
          onMouseDown={handleButtonAction('jump', true)}
          onMouseUp={handleButtonAction('jump', false)}
          onTouchStart={handleButtonAction('jump', true)}
          onTouchEnd={handleButtonAction('jump', false)}
          aria-label="លោត (Jump)"
        >
          <ChevronUp size={28} color="#fef08a" />
          <span style={{ marginTop: -2 }}>លោត</span>
        </button>
      </div>
    </div>
  );
}
