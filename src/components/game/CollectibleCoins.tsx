import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { CollectibleItem } from '../../types/game';

interface CollectibleCoinsProps {
  items: CollectibleItem[];
  playerPosition: [number, number, number];
  onCollect: (id: string) => void;
}

// Simple synthesizer sound for coin collection using Web Audio API
function playCoinSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Audio context might be restricted before user gesture
  }
}

function Coin({
  item,
  playerPosition,
  onCollect,
}: {
  item: CollectibleItem;
  playerPosition: [number, number, number];
  onCollect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const collectedRef = useRef(false);

  useFrame((state, delta) => {
    if (!meshRef.current || item.collected) return;

    // Spin coin
    meshRef.current.rotation.y += delta * 2.5;

    // Floating bob
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = item.position[1] + Math.sin(t * 3 + item.position[0]) * 0.15;

    // Distance check with player
    const pX = playerPosition[0];
    const pZ = playerPosition[2];
    const cX = item.position[0];
    const cZ = item.position[2];

    const dist = Math.sqrt((pX - cX) ** 2 + (pZ - cZ) ** 2);
    if (dist < 1.4 && !collectedRef.current) {
      collectedRef.current = true;
      playCoinSound();
      onCollect(item.id);
    }
  });

  if (item.collected) return null;

  return (
    <group ref={meshRef} position={item.position}>
      {/* Outer Coin Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 16]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#d97706"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      {/* Inner Khmer Motif Star / Gem */}
      <mesh>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#f59e0b"
          emissiveIntensity={1}
          metalness={0.9}
        />
      </mesh>
      {/* Subtle Glow Light */}
      <pointLight color="#f59e0b" intensity={1.5} distance={3} />
    </group>
  );
}

export function CollectibleCoins({ items, playerPosition, onCollect }: CollectibleCoinsProps) {
  return (
    <group name="collectibles">
      {items.map((item) => (
        <Coin
          key={item.id}
          item={item}
          playerPosition={playerPosition}
          onCollect={onCollect}
        />
      ))}
    </group>
  );
}
