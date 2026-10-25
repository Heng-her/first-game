import { useState, useEffect } from 'react';
import type { PlayerControls } from '../types/game';

export function useKeyboardControls(): PlayerControls {
  const [controls, setControls] = useState<PlayerControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid scrolling on space/arrows when playing
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      setControls((prev) => {
        switch (e.code) {
          case 'KeyW':
          case 'ArrowUp':
            return { ...prev, forward: true };
          case 'KeyS':
          case 'ArrowDown':
            return { ...prev, backward: true };
          case 'KeyA':
          case 'ArrowLeft':
            return { ...prev, left: true };
          case 'KeyD':
          case 'ArrowRight':
            return { ...prev, right: true };
          case 'ShiftLeft':
          case 'ShiftRight':
            return { ...prev, run: true };
          case 'Space':
            return { ...prev, jump: true };
          default:
            return prev;
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setControls((prev) => {
        switch (e.code) {
          case 'KeyW':
          case 'ArrowUp':
            return { ...prev, forward: false };
          case 'KeyS':
          case 'ArrowDown':
            return { ...prev, backward: false };
          case 'KeyA':
          case 'ArrowLeft':
            return { ...prev, left: false };
          case 'KeyD':
          case 'ArrowRight':
            return { ...prev, right: false };
          case 'ShiftLeft':
          case 'ShiftRight':
            return { ...prev, run: false };
          case 'Space':
            return { ...prev, jump: false };
          default:
            return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls;
}
