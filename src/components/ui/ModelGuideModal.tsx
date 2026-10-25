import { X, BookOpen, Layers, CheckCircle2, AlertCircle, Sparkles, FolderDown } from 'lucide-react';
import { useModelAvailability } from '../../hooks/useModelAvailability';

interface ModelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelGuideModal({ isOpen, onClose }: ModelGuideModalProps) {
  const isMapReady = useModelAvailability('/models/map/angkor-world.glb');
  const isPlayerReady = useModelAvailability('/models/characters/player.glb');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          borderRadius: 20,
          overflowY: 'auto',
          padding: '28px',
          color: '#f8fafc',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#f59e0b' }}>
                មេរៀនភ្ជាប់ File 3D ជាមួយ Web Code
              </h2>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                របៀប Load ផែនទី, តួអង្គ និង Animation ក្នុង Three.js / React Three Fiber
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Live File Detection Status */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 14,
            padding: 16,
            marginBottom: 24,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#cbd5e1' }}>
            ស្ថានភាពឯកសារ 3D ក្នុង Project របស់អ្នក (Live Status):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontFamily: 'monospace' }}>public/models/map/angkor-world.glb</span>
              {isMapReady ? (
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <CheckCircle2 size={16} /> រកឃើញ (Loaded)
                </span>
              ) : (
                <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <AlertCircle size={16} /> មិនទាន់មាន (ប្រើ Fallback Temple)
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontFamily: 'monospace' }}>public/models/characters/player.glb</span>
              {isPlayerReady ? (
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <CheckCircle2 size={16} /> រកឃើញ (Loaded)
                </span>
              ) : (
                <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <AlertCircle size={16} /> មិនទាន់មាន (ប្រើ Fallback Explorer)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step 1: File Types */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Layers size={18} color="#f59e0b" /> ១. File 3D ប្រភេទអ្វីដែលគួរប្រើ?
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#cbd5e1' }}>
            គួរប្រើប្រាស់ប្រភេទ <strong style={{ color: '#38bdf8' }}>.glb (Binary GLTF)</strong> ព្រោះវាបានបង្កប់
            <strong> 3D Mesh, Textures, Materials, Skeleton/Rig</strong> និង <strong>Animations (ចលនា)</strong>
            ទាំងអស់រួមគ្នាក្នុង File តែមួយ ដែលធ្វើឱ្យការ Load លើ Browser មានល្បឿនលឿនបំផុត។
          </p>
        </div>

        {/* Step 2: Directory Structure */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <FolderDown size={18} color="#f59e0b" /> ២. ទីតាំងដាក់ File ក្នុង Project
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#cbd5e1', marginBottom: 10 }}>
            អ្នកគ្រាន់តែទាញទម្លាក់ (Drag & Drop) File 3D ចូលទៅក្នុងថតខាងក្រោម៖
          </p>
          <pre
            style={{
              background: '#090d16',
              padding: 14,
              borderRadius: 10,
              fontSize: 12.5,
              lineHeight: 1.5,
              color: '#38bdf8',
              overflowX: 'auto',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
{`public/models/
├── map/
│   └── angkor-world.glb      <-- ផែនទី ទីក្រុង ឬបរិស្ថាន
├── characters/
│   └── player.glb            <-- តួអង្គមានចលនា (Rigged + Animations)
├── vehicles/
│   └── tuk-tuk.glb           <-- ម៉ូតូកង់បី (Tuk-Tuk/Remork)
└── environment/
    └── tree.glb              <-- ដើមឈើ ឬវត្ថុផ្សេងៗ`}
          </pre>
        </div>

        {/* Step 3: Code Connection */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Sparkles size={18} color="#f59e0b" /> ៣. របៀបភ្ជាប់ក្នុងកូដ (Code Connection)
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#cbd5e1', marginBottom: 10 }}>
            ប្រើ <code>useGLTF</code> និង <code>useAnimations</code> ពីបណ្ណាល័យ <code>@react-three/drei</code>៖
          </p>
          <pre
            style={{
              background: '#090d16',
              padding: 14,
              borderRadius: 10,
              fontSize: 12.5,
              lineHeight: 1.5,
              color: '#a7f3d0',
              overflowX: 'auto',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
{`import { useGLTF, useAnimations } from "@react-three/drei";

export function Player() {
  // 1. Load File .glb
  const { scene, animations } = useGLTF("/models/characters/player.glb");
  
  // 2. ស្រង់យក Animations (ដូចជា Idle, Walk, Run, Jump)
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    // 3. បញ្ជាឱ្យលេង Animation
    actions["Walk"]?.play();
  }, [actions]);

  return <primitive object={scene} />;
}`}
          </pre>
        </div>

        {/* Resources */}
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 16, borderRadius: 12 }}>
          <h4 style={{ fontSize: 14, color: '#f59e0b', marginBottom: 6 }}>កន្លែងទាញយក File 3D ដោយឥតគិតថ្លៃ៖</h4>
          <ul style={{ fontSize: 13, color: '#cbd5e1', paddingLeft: 20, lineHeight: 1.7 }}>
            <li><strong>Mixamo.com</strong> — សម្រាប់ទាញយក Character និង Animation (Walk, Run, Jump) ដោយឥតគិតថ្លៃ។</li>
            <li><strong>Sketchfab.com</strong> — សម្រាប់ស្វែងរកម៉ូដែលប្រាសាទអង្គរវត្ត និងទេសភាពកម្ពុជា (.glb format)។</li>
            <li><strong>Kenney.nl</strong> — សម្រាប់ 3D Game Assets ឥតគិតថ្លៃ (CC0 License)។</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
