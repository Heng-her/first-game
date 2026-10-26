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
      {/* Soft Ambient Light for shadows */}
      <ambientLight intensity={0.8} />
      
      {/* Sun / Key Directional Light with Optimized 1024 Shadows for WebGL Performance */}
      <directionalLight
        position={[35, 55, 30]}
        intensity={1.75}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0004}
      />

      {/* Subtle fill light */}
      <directionalLight position={[-25, 20, -25]} intensity={0.4} color="#bae6fd" />
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
        camera={{ position: [0, 9.5, 17], fov: 50 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* Cambodian Tropical Sun & Blue Sky */}
        <Sky
          distance={450000}
          sunPosition={[25, 35, 20]}
          inclination={0.49}
          azimuth={0.25}
          turbidity={6}
          rayleigh={1.2}
        />
        {/* Expansive tropical fog suited for the 400m adventure map */}
        <fog attach="fog" args={['#e0f2fe', 60, 320]} />

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
