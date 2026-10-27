import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, useFBX } from "@react-three/drei";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { useModelAvailability } from "../../hooks/useModelAvailability";

export interface PlayerProps {
  modelUrl?: string;
  isMoving: boolean;
  isRunning: boolean;
  isGrounded: boolean;
  movementState?: 'idle' | 'walk' | 'run' | 'sprint' | 'jump' | 'fall' | 'land';
  movementSpeed?: number;
  activeEmote?: string | null;
  animationSpeed?: number;
  onAnimationsDiscovered?: (names: string[]) => void;
}

// 1. GLTF / GLB Character Loader with Robust Animation State Machine
function LoadedGLTFPlayer({
  url,
  isMoving,
  isRunning: _isRunning,
  isGrounded: _isGrounded,
  movementState = 'idle',
  movementSpeed = 0,
  activeEmote,
  animationSpeed = 1.0,
  onAnimationsDiscovered,
}: PlayerProps & { url: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions, names, mixer } = useAnimations(animations, group);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);

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

  // Animation State Machine with Smooth Cross-fading and Foot-Sliding Prevention
  useEffect(() => {
    if (!actions || names.length === 0) return;

    const findAction = (keyword: string) => {
      // 1. Exact match
      if (actions[keyword]) return actions[keyword];
      // 2. Case-insensitive exact match
      const exact = names.find((n) => n.toLowerCase() === keyword.toLowerCase());
      if (exact && actions[exact]) return actions[exact];
      // 3. Substring match
      const sub = names.find((n) => n.toLowerCase().includes(keyword.toLowerCase()));
      return sub ? actions[sub] : null;
    };

    let targetAction: THREE.AnimationAction | null = null;
    let isLooping = true;
    let targetTimeScale = 1.0;

    // Emote animation has highest priority when standing still
    if (activeEmote && actions[activeEmote] && !isMoving) {
      targetAction = actions[activeEmote];
    } else {
      switch (movementState) {
        case 'jump':
          targetAction = findAction('jump') || findAction('air');
          isLooping = false;
          break;
        case 'fall':
          targetAction = findAction('fall') || findAction('air') || findAction('jump');
          isLooping = true;
          break;
        case 'land':
          targetAction = findAction('land') || findAction('idle');
          isLooping = false;
          break;
        case 'sprint':
          targetAction = findAction('sprint') || findAction('run') || findAction('walk');
          isLooping = true;
          targetTimeScale = Math.max(1.0, (movementSpeed || 10) / 9.0);
          break;
        case 'run':
          targetAction = findAction('run') || findAction('sprint') || findAction('walk');
          isLooping = true;
          targetTimeScale = Math.max(0.85, (movementSpeed || 8.5) / 8.0);
          break;
        case 'walk':
          targetAction = findAction('walk') || findAction('run');
          isLooping = true;
          // Scale walk speed dynamically to match movement velocity and eliminate foot sliding
          targetTimeScale = Math.max(0.7, (movementSpeed || 4.5) / 4.5);
          break;
        case 'idle':
        default:
          targetAction = findAction('idle') || actions[names[0]];
          isLooping = true;
          targetTimeScale = 1.0;
          break;
      }
    }

    // Fallback if targetAction wasn't found
    if (!targetAction) {
      targetAction = findAction('idle') || actions[names[0]];
    }

    const prevAction = currentActionRef.current;

    if (targetAction) {
      if (prevAction !== targetAction) {
        if (prevAction) {
          prevAction.fadeOut(0.2);
        }
        targetAction.reset();
        targetAction.setEffectiveTimeScale(targetTimeScale * animationSpeed);
        targetAction.setEffectiveWeight(1);
        if (!isLooping) {
          targetAction.clampWhenFinished = true;
          targetAction.loop = THREE.LoopOnce;
        } else {
          targetAction.loop = THREE.LoopRepeat;
        }
        targetAction.fadeIn(0.2).play();
        currentActionRef.current = targetAction;
      } else {
        // Just update speed if same action continues (e.g. gradual acceleration)
        targetAction.setEffectiveTimeScale(targetTimeScale * animationSpeed);
      }
    }
  }, [actions, names, movementState, movementSpeed, isMoving, activeEmote, animationSpeed]);

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
      clonedClip.name = "FastRun";
      // In-place fix for root hip displacement so camera & player controller can move naturally
      const hipTrack = clonedClip.tracks.find((t) =>
        t.name.includes("Hips.position"),
      );
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

    const fastRunAction = actions["FastRun"] || actions[names[0]];
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
function FallbackStylizedPlayer({
  isMoving,
  isRunning,
  isGrounded,
}: PlayerProps) {
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
        bodyRef.current.position.y =
          Math.abs(Math.sin(t * speedMultiplier)) * 0.08;
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
        <meshStandardMaterial color="#c2782b" roughness={0.7} />
      </mesh>

      {/* Explorer Shirt Inner Collar */}
      <mesh position={[0, 1.5, 0.05]} castShadow>
        <boxGeometry args={[0.28, 0.16, 0.28]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>

      {/* Traditional Khmer Kroma Scarf (Wrapped around the neck) */}
      <mesh position={[0, 1.58, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.23, 0.07, 8, 20]} />
        <meshStandardMaterial color="#991b1b" roughness={0.75} />
      </mesh>
      {/* Kroma Scarf Hanging Tail on chest */}
      <mesh position={[0.08, 1.34, 0.2]} rotation={[0.1, 0, -0.1]} castShadow>
        <boxGeometry args={[0.12, 0.36, 0.05]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.8} />
      </mesh>

      {/* Explorer Leather Belt with Brass Buckle */}
      <mesh position={[0, 0.94, 0]} castShadow>
        <boxGeometry args={[0.56, 0.09, 0.36]} />
        <meshStandardMaterial color="#451a03" roughness={0.6} />
      </mesh>
      {/* Golden Belt Buckle */}
      <mesh position={[0, 0.94, 0.19]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.03]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Explorer Backpack with Straps */}
      <mesh position={[0, 1.3, -0.24]} castShadow>
        <boxGeometry args={[0.44, 0.5, 0.22]} />
        <meshStandardMaterial color="#334155" roughness={0.85} />
      </mesh>
      {/* Backpack Gold Badge */}
      <mesh position={[0, 1.35, -0.36]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.82, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.7} />
      </mesh>

      {/* Stylized Eyes */}
      <mesh position={[-0.07, 1.84, 0.19]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      <mesh position={[0.07, 1.84, 0.19]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>

      {/* Explorer Safari Hat with Golden Ribbon */}
      <group position={[0, 1.97, 0]}>
        {/* Hat Rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.44, 0.44, 0.04, 16]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Hat Crown */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.26, 0.24, 16]} />
          <meshStandardMaterial color="#854d0e" roughness={0.8} />
        </mesh>
        {/* Golden Hat Band */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.265, 0.265, 0.05, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Left Arm with Sleeve */}
      <group ref={leftArmRef} position={[-0.38, 1.5, 0]}>
        {/* Sleeve */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.18, 8, 8]} />
          <meshStandardMaterial color="#c2782b" roughness={0.7} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.38, 8, 8]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.7} />
        </mesh>
      </group>

      {/* Right Arm with Sleeve */}
      <group ref={rightArmRef} position={[0.38, 1.5, 0]}>
        {/* Sleeve */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.18, 8, 8]} />
          <meshStandardMaterial color="#c2782b" roughness={0.7} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.38, 8, 8]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.7} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.18, 0.9, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Explorer Boot with Sole */}
        <mesh position={[0, -0.82, 0.06]} castShadow>
          <boxGeometry args={[0.15, 0.14, 0.28]} />
          <meshStandardMaterial color="#3b200b" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.88, 0.06]} receiveShadow>
          <boxGeometry args={[0.16, 0.04, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.18, 0.9, 0]}>
        <mesh position={[0, -0.42, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.6, 8, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Explorer Boot with Sole */}
        <mesh position={[0, -0.82, 0.06]} castShadow>
          <boxGeometry args={[0.15, 0.14, 0.28]} />
          <meshStandardMaterial color="#3b200b" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.88, 0.06]} receiveShadow>
          <boxGeometry args={[0.16, 0.04, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// 4. Main Player Component
export function Player({
  modelUrl = "/models/characters/new.glb",
  ...props
}: PlayerProps) {
  const isAvailable = useModelAvailability(modelUrl);

  if (isAvailable) {
    if (modelUrl.toLowerCase().endsWith(".fbx")) {
      return <LoadedFBXPlayer url={modelUrl} {...props} />;
    }
    return <LoadedGLTFPlayer url={modelUrl} {...props} />;
  }

  return <FallbackStylizedPlayer {...props} />;
}
