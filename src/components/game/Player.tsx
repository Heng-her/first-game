import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, useFBX } from '@react-three/drei';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useModelAvailability } from '../../hooks/useModelAvailability';

export interface PlayerProps {
  modelUrl?: string;
  isMoving: boolean;
  isRunning: boolean;
  isGrounded: boolean;
  activeEmote?: string | null;
  animationSpeed?: number;
  onAnimationsDiscovered?: (names: string[]) => void;
}

// 1. GLTF / GLB Character Loader
function LoadedGLTFPlayer({
  url,
  isMoving,
  isRunning,
  isGrounded,
  activeEmote,
  animationSpeed = 1.0,
  onAnimationsDiscovered,
}: PlayerProps & { url: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions, names, mixer } = useAnimations(animations, group);

  // Auto-scale model so all characters have standard 1.8m height
  const { scale, offsetY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const rawHeight = box.max.y - box.min.y;
    const targetHeight = 1.8;
    const s = rawHeight > 0.05 ? targetHeight / rawHeight : 1;
    const offY = -box.min.y * s;
    return { scale: s, offsetY: offY };
  }, [scene]);

  // Enable shadow casting for character meshes
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Notify parent of discovered animations
  useEffect(() => {
    if (names && names.length > 0 && onAnimationsDiscovered) {
      onAnimationsDiscovered(names);
    }
  }, [names, onAnimationsDiscovered]);

  // Update mixer timeScale based on user speed setting
  useEffect(() => {
    if (mixer) {
      mixer.timeScale = animationSpeed;
    }
  }, [mixer, animationSpeed]);

  // Handle animation clips transitions
  useEffect(() => {
    if (!actions || names.length === 0) return;

    const findAction = (keyword: string) => {
      const match = names.find((n) => n.toLowerCase() === keyword.toLowerCase()) ||
                    names.find((n) => n.toLowerCase().includes(keyword.toLowerCase()));
      return match ? actions[match] : null;
    };

    let targetAction: THREE.AnimationAction | null = null;

    // Emote animation has priority when standing still
    if (activeEmote && actions[activeEmote] && !isMoving) {
      targetAction = actions[activeEmote];
    } else if (!isGrounded) {
      targetAction = findAction('jump') || findAction('air');
    } else if (isMoving) {
      targetAction = isRunning
        ? findAction('run') || findAction('sprint') || findAction('walk')
        : findAction('walk') || findAction('run');
    } else {
      targetAction = findAction('idle') || actions[names[0]];
    }

    if (targetAction) {
      targetAction.reset().fadeIn(0.2).play();
    }

    return () => {
      if (targetAction) targetAction.fadeOut(0.2);
    };
  }, [actions, names, isMoving, isRunning, isGrounded, activeEmote]);

  return (
    <group ref={group}>
      <group scale={scale} position={[0, offsetY, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// 2. FBX Character & Animation Loader (specifically handles Fast-Run.fbx)
function LoadedFBXPlayer({
  url,
  isMoving,
  isRunning: _isRunning,
  isGrounded: _isGrounded,
  activeEmote,
  animationSpeed = 1.0,
  onAnimationsDiscovered,
}: PlayerProps & { url: string }) {
  const group = useRef<THREE.Group>(null);
  const rawFbx = useFBX(url);

  const { fbxScene, animations } = useMemo(() => {
    const cloned = SkeletonUtils.clone(rawFbx) as THREE.Group;

    // Enable shadows on all child meshes
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshPhongMaterial;
          mat.shininess = 30;
        }
      }
    });

    // Auto-scale FBX (Mixamo cm to Three.js meters)
    const box = new THREE.Box3().setFromObject(cloned);
    const rawHeight = box.max.y - box.min.y;
    const targetHeight = 1.8;
    const s = rawHeight > 0.05 ? targetHeight / rawHeight : 0.01;
    cloned.scale.setScalar(s);
    cloned.position.y = -box.min.y * s;

    // Clone animations and apply in-place root motion fix
    const clips = rawFbx.animations.map((clip) => {
      const clonedClip = clip.clone();
      clonedClip.name = 'FastRun';
      // In-place fix for root hip displacement so camera & player controller can move naturally
      const hipTrack = clonedClip.tracks.find((t) => t.name.includes('Hips.position'));
      if (hipTrack) {
        const initialZ = hipTrack.values[2];
        const initialX = hipTrack.values[0];
        for (let i = 0; i < hipTrack.values.length; i += 3) {
          hipTrack.values[i] = hipTrack.values[i] - initialX;
          hipTrack.values[i + 2] = hipTrack.values[i + 2] - initialZ;
        }
      }
      return clonedClip;
    });

    return { fbxScene: cloned, animations: clips };
  }, [rawFbx]);

  const { actions, names, mixer } = useAnimations(animations, group);

  // Notify parent of discovered animations
  useEffect(() => {
    if (names && names.length > 0 && onAnimationsDiscovered) {
      onAnimationsDiscovered(names);
    }
  }, [names, onAnimationsDiscovered]);

  // Update mixer timeScale based on user speed setting
  useEffect(() => {
    if (mixer) {
      mixer.timeScale = animationSpeed;
    }
  }, [mixer, animationSpeed]);

  // Handle FBX Animation playback
  useEffect(() => {
    if (!actions || names.length === 0) return;

    const fastRunAction = actions['FastRun'] || actions[names[0]];
    if (!fastRunAction) return;

    // If moving or emote active, play FastRun loop
    if (isMoving || activeEmote) {
      fastRunAction.reset().fadeIn(0.2).play();
    } else {
      // Return to standing pose
      fastRunAction.fadeOut(0.2);
    }

    return () => {
      fastRunAction.fadeOut(0.2);
    };
  }, [actions, names, isMoving, activeEmote]);

  return (
    <group ref={group}>
      <primitive object={fbxScene} />
    </group>
  );
}

// 3. Stylized Animated 3D Explorer Tourist Fallback
function FallbackStylizedPlayer({ isMoving, isRunning, isGrounded }: PlayerProps) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speedMultiplier = isRunning ? 14 : 8;

    if (!isGrounded) {
      if (leftArmRef.current) leftArmRef.current.rotation.x = -1.2;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -1.2;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0.5;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -0.3;
      if (bodyRef.current) bodyRef.current.position.y = 0.1;
    } else if (isMoving) {
      const swing = Math.sin(t * speedMultiplier) * (isRunning ? 0.8 : 0.5);
      if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing;

      if (bodyRef.current) {
        bodyRef.current.position.y = Math.abs(Math.sin(t * speedMultiplier)) * 0.08;
      }
    } else {
      const breath = Math.sin(t * 2) * 0.03;
      if (leftArmRef.current) leftArmRef.current.rotation.x = breath * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -breath * 0.5;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (bodyRef.current) bodyRef.current.position.y = breath;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Torso / Explorer Vest */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.55, 0.65, 0.35]} />
        <meshStandardMaterial color="#d97706" roughness={0.7} />
      </mesh>

      {/* Explorer Backpack */}
      <mesh position={[0, 1.3, -0.24]} castShadow>
        <boxGeometry args={[0.42, 0.48, 0.2]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.78, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.8} />
      </mesh>

      {/* Explorer Safari Hat */}
      <group position={[0, 1.94, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 16]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.24, 0.22, 16]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.38, 1.5, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.45, 8, 8]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.7} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.38, 1.5, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.45, 8, 8]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.7} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.18, 0.9, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.82, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.12, 0.25]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.18, 0.9, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.82, 0.06]} castShadow>
          <boxGeometry args={[0.14, 0.12, 0.25]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
}

// 4. Main Player Component
export function Player({
  modelUrl = '/models/characters/ItEngineer.glb',
  ...props
}: PlayerProps) {
  const isAvailable = useModelAvailability(modelUrl);

  if (isAvailable) {
    if (modelUrl.toLowerCase().endsWith('.fbx')) {
      return <LoadedFBXPlayer url={modelUrl} {...props} />;
    }
    return <LoadedGLTFPlayer url={modelUrl} {...props} />;
  }

  return <FallbackStylizedPlayer {...props} />;
}
