import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, OrbitControls } from '@react-three/drei';
import { WorldMap } from './WorldMap';
import { PlayerController } from './PlayerController';
import { CollectibleCoins } from './CollectibleCoins';
import { FollowCamera } from './FollowCamera';
import type { PlayerControls, PlayerState, CollectibleItem } from '../../types/game';

interface GameSceneProps {
  controls: PlayerControls;
  playerState: PlayerState;
  onPlayerStateChange: (state: PlayerState) => void;
  collectibles: CollectibleItem[];
  onCollectCoin: (id: string) => void;
  cameraMode: 'follow' | 'orbit';
  modelUrl?: string;
  activeEmote?: string | null;
  animationSpeed?: number;
  onAnimationsDiscovered?: (names: string[]) => void;
}

function SceneLighting() {
  return (
    <>
      {/* Soft Ambient Light for crystal clear visibility */}
      <ambientLight intensity={0.9} color="#ffffff" />
      
      {/* Crisp Sun / Key Directional Light with Sharp Shadows */}
      <directionalLight
        position={[40, 55, 30]}
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={220}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
        shadow-bias={-0.0003}
      />

      {/* Clear Fill Light */}
      <directionalLight position={[-30, 25, -25]} intensity={0.5} color="#bae6fd" />
    </>
  );
}

export function GameScene({
  controls,
  playerState,
  onPlayerStateChange,
  collectibles,
  onCollectCoin,
  cameraMode,
  modelUrl,
  activeEmote,
  animationSpeed,
  onAnimationsDiscovered,
}: GameSceneProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        dpr={[1, 2]} // Crisp native resolution on Retina & 4K displays
        camera={{ position: [0, 9.5, 17], fov: 50 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Crystal Clear Blue Sky */}
        <Sky
          distance={450000}
          sunPosition={[30, 40, 25]}
          inclination={0.48}
          azimuth={0.25}
          turbidity={4}
          rayleigh={0.8}
        />

        <SceneLighting />

        <Suspense fallback={null}>
          {/* 3D Map / Environment */}
          <WorldMap />

          {/* Player Controller & Animated Character */}
          <PlayerController
            controls={controls}
            onStateChange={onPlayerStateChange}
            modelUrl={modelUrl}
            activeEmote={activeEmote}
            animationSpeed={animationSpeed}
            onAnimationsDiscovered={onAnimationsDiscovered}
          />

          {/* Treasure Hunt Collectible Coins (Mode A) */}
          <CollectibleCoins
            items={collectibles}
            playerPosition={playerState.position}
            onCollect={onCollectCoin}
          />
        </Suspense>

        {/* Camera mode: 3rd person follow or free orbit */}
        {cameraMode === 'follow' ? (
          <FollowCamera targetPosition={playerState.position} enabled={true} />
        ) : (
          <OrbitControls
            target={[playerState.position[0], 1.5, playerState.position[2]]}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={3}
            maxDistance={35}
          />
        )}
      </Canvas>
    </div>
  );
}
