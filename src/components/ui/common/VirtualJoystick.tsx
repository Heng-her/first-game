import { useState, useRef, useEffect, useCallback } from "react";
import type { RefObject } from "react";
import {
  Zap,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { VirtualInput } from "../../../data/soldierConfig";
import { soundFX } from "../../../utils/audio";

interface VirtualJoystickProps {
  virtualInputRef: RefObject<VirtualInput>;
}

export function VirtualJoystick({ virtualInputRef }: VirtualJoystickProps) {
  // Mobile / Touch device detection
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);

  const baseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  // Maximum travel radius for the inner knob in pixels
  const MAX_RADIUS = 44;

  useEffect(() => {
    const checkDevice = () => {
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth <= 1024;
      setIsMobile(hasTouch);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const updateInputVector = useCallback(
    (dx: number, dy: number, sprinting: boolean) => {
      if (!virtualInputRef.current) return;

      const dist = Math.hypot(dx, dy);
      if (dist < 4) {
        virtualInputRef.current.forward = 0;
        virtualInputRef.current.side = 0;
        virtualInputRef.current.isRunning = false;
        return;
      }

      // Normalized coordinates [-1, 1]
      // Dragging UP on screen is negative Y -> forward positive!
      const forward = -Math.max(-1, Math.min(1, dy / MAX_RADIUS));
      const side = Math.max(-1, Math.min(1, dx / MAX_RADIUS));

      virtualInputRef.current.forward = forward;
      virtualInputRef.current.side = side;
      // Auto-sprint if dragged to maximum extent or sprint button held
      virtualInputRef.current.isRunning =
        sprinting || dist >= MAX_RADIUS * 0.92;
    },
    [MAX_RADIUS, virtualInputRef],
  );

  // Handle Touch on the Circular Movement Base
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    soundFX.unlockAudio();
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsDragging(true);

    if (baseRef.current) {
      const rect = baseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = touch.clientX - centerX;
      let dy = touch.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist > MAX_RADIUS) {
        dx = (dx / dist) * MAX_RADIUS;
        dy = (dy / dist) * MAX_RADIUS;
      }

      setKnobPos({ x: dx, y: dy });
      updateInputVector(dx, dy, isSprinting);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchIdRef.current === null || !baseRef.current) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        const rect = baseRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist > MAX_RADIUS) {
          dx = (dx / dist) * MAX_RADIUS;
          dy = (dy / dist) * MAX_RADIUS;
        }

        setKnobPos({ x: dx, y: dy });
        updateInputVector(dx, dy, isSprinting);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchIdRef.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsDragging(false);
        setKnobPos({ x: 0, y: 0 });
        if (virtualInputRef.current) {
          virtualInputRef.current.forward = 0;
          virtualInputRef.current.side = 0;
          virtualInputRef.current.isRunning = false;
        }
        break;
      }
    }
  };

  // Toggle Sprint Button
  const handleSprintStart = () => {
    soundFX.unlockAudio();
    setIsSprinting(true);
    if (virtualInputRef.current) {
      virtualInputRef.current.isRunning = true;
    }
  };

  const handleSprintEnd = () => {
    setIsSprinting(false);
    if (virtualInputRef.current) {
      virtualInputRef.current.isRunning = false;
    }
  };

  // If on desktop (no touch screen), return NULL to keep the screen completely clean!
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* 1. CIRCULAR TOUCH MOVEMENT JOYSTICK (Bottom-Left) */}
      <div
        ref={baseRef}
        data-control="true"
        onTouchStart={(e) => {
          e.stopPropagation();
          handleTouchStart(e);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          position: "absolute",
          bottom: "max(24px, env(safe-area-inset-bottom))",
          left: "max(24px, env(safe-area-inset-left))",
          width: "128px",
          height: "128px",
          borderRadius: "50%",
          background: isDragging
            ? "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(15, 23, 42, 0.75) 100%)"
            : "radial-gradient(circle, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%)",
          border: isDragging
            ? "2px solid #38bdf8"
            : "2px solid rgba(56, 189, 248, 0.4)",
          boxShadow: isDragging
            ? "0 0 24px rgba(56, 189, 248, 0.5), inset 0 0 16px rgba(56, 189, 248, 0.25)"
            : "0 8px 30px rgba(0, 0, 0, 0.5), inset 0 0 12px rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          zIndex: 50,
          pointerEvents: "auto",
        }}
      >
        {/* Directional Indicator Chevrons */}
        <div style={{ position: "absolute", top: 6, opacity: 0.5 }}>
          <ChevronUp size={16} color="#38bdf8" />
        </div>
        <div style={{ position: "absolute", bottom: 6, opacity: 0.5 }}>
          <ChevronDown size={16} color="#38bdf8" />
        </div>
        <div style={{ position: "absolute", left: 6, opacity: 0.5 }}>
          <ChevronLeft size={16} color="#38bdf8" />
        </div>
        <div style={{ position: "absolute", right: 6, opacity: 0.5 }}>
          <ChevronRight size={16} color="#38bdf8" />
        </div>

        {/* Center Target Dot */}
        <div
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "rgba(56, 189, 248, 0.3)",
          }}
        />

        {/* Dynamic Draggable Thumb Knob (រង្វង់ចុចផ្លាស់ប្តូរ) */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: isDragging
              ? "radial-gradient(circle at 35% 35%, #7dd3fc 0%, #0284c7 100%)"
              : "radial-gradient(circle at 35% 35%, #38bdf8 0%, #0369a1 100%)",
            border: "2px solid #ffffff",
            boxShadow: isDragging
              ? "0 0 16px rgba(56, 189, 248, 0.8), 0 4px 12px rgba(0, 0, 0, 0.6)"
              : "0 4px 12px rgba(0, 0, 0, 0.4)",
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: isDragging ? "none" : "transform 0.18s ease-out",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* 2. CIRCULAR SPRINT / RUN BUTTON (Bottom-Right) */}
      <div
        data-control="true"
        onTouchStart={(e) => {
          e.stopPropagation();
          handleSprintStart();
        }}
        onTouchEnd={handleSprintEnd}
        onTouchCancel={handleSprintEnd}
        style={{
          position: "absolute",
          bottom: "max(32px, env(safe-area-inset-bottom))",
          right: "max(24px, env(safe-area-inset-right))",
          width: "68px",
          height: "68px",
          borderRadius: "50%",
          background: isSprinting
            ? "radial-gradient(circle at 35% 35%, #f87171 0%, #b91c1c 100%)"
            : "radial-gradient(circle at 35% 35%, rgba(239, 68, 68, 0.4) 0%, rgba(15, 23, 42, 0.75) 100%)",
          border: isSprinting
            ? "2.5px solid #ffffff"
            : "2px solid rgba(239, 68, 68, 0.5)",
          boxShadow: isSprinting
            ? "0 0 24px rgba(239, 68, 68, 0.7), 0 4px 16px rgba(0, 0, 0, 0.5)"
            : "0 6px 20px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          zIndex: 50,
          pointerEvents: "auto",
          cursor: "pointer",
          transform: isSprinting ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.1s ease",
        }}
      >
        <Zap
          size={22}
          color={isSprinting ? "#ffffff" : "#f87171"}
          fill={isSprinting ? "#ffffff" : "transparent"}
        />
        <span
          style={{
            fontSize: "10px",
            fontWeight: 800,
            color: isSprinting ? "#ffffff" : "#fca5a5",
            marginTop: 1,
          }}
        >
          {isSprinting ? "រត់" : "RUN"}
        </span>
      </div>
    </>
  );
}
