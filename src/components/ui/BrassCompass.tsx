import { useMemo } from 'react';

interface BrassCompassProps {
  rotation: number; // Player's rotation angle in radians
  size?: number;
}

export function BrassCompass({ rotation, size = 110 }: BrassCompassProps) {
  // Convert radians to degrees: player rotation is inverted for compass needle pointing North
  const degrees = useMemo(() => {
    const deg = (rotation * 180) / Math.PI;
    return -deg;
  }, [rotation]);

  return (
    <div
      className="brass-casing"
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      title="ត្រីវិស័យបុរាណ (Ancient Brass Compass)"
    >
      {/* Outer Knurled Ring Teeth (Tick marks) */}
      <svg
        width={size - 10}
        height={size - 10}
        viewBox="0 0 100 100"
        style={{
          position: 'absolute',
          transform: `rotate(${degrees}deg)`,
          transition: 'transform 0.1s linear',
        }}
      >
        {/* Compass Dial Face */}
        <circle cx="50" cy="50" r="46" fill="#1e180d" stroke="#854d0e" strokeWidth="2" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#d97706" strokeWidth="0.8" strokeDasharray="1.5, 2.5" />
        
        {/* 16 Ticks around dial */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const isMajor = i % 4 === 0;
          return (
            <line
              key={i}
              x1="50"
              y1={isMajor ? "6" : "9"}
              x2="50"
              y2="13"
              stroke={isMajor ? "#fbbf24" : "#92400e"}
              strokeWidth={isMajor ? "2" : "1"}
              transform={`rotate(${angle} 50 50)`}
            />
          );
        })}

        {/* Cardinal Directions (Khmer & English) */}
        {/* North / ជើង */}
        <text x="50" y="24" fill="#ef4444" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          N
        </text>
        <text x="50" y="31" fill="#fca5a5" fontSize="6" fontWeight="700" textAnchor="middle">
          ជើង
        </text>

        {/* South / ត្បូង */}
        <text x="50" y="82" fill="#94a3b8" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          S
        </text>

        {/* East / កើត */}
        <text x="80" y="53" fill="#cbd5e1" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          E
        </text>

        {/* West / លិច */}
        <text x="20" y="53" fill="#cbd5e1" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          W
        </text>
      </svg>

      {/* Dynamic 3D Compass Needle */}
      <div
        style={{
          position: 'absolute',
          width: 8,
          height: size - 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          filter: 'drop-shadow(0 3px 5px rgba(0, 0, 0, 0.7))',
        }}
      >
        {/* North Red Pointer */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderBottom: `${(size - 36) / 2}px solid #dc2626`,
          }}
        />
        {/* Central Pivot Nut */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #fef08a 0%, #ca8a04 60%, #451a03 100%)',
            border: '1.5px solid #78350f',
            boxShadow: '0 2px 4px rgba(0,0,0,0.6)',
            zIndex: 2,
          }}
        />
        {/* South Steel Pointer */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `${(size - 36) / 2}px solid #94a3b8`,
          }}
        />
      </div>

      {/* Glass Reflection Sheen Dome */}
      <div className="compass-glass" />
    </div>
  );
}
