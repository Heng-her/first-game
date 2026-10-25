Gobkit Free Character Pack Vol.2 — 8 CC0 rigged & animated low-poly characters (GLB)
https://gobkit.com/freebies

Characters: Sales Rep, IT Engineer, Security Guard, Office Intern, Receptionist, Accountant, Office Manager, Company CEO
Each .glb has its texture baked in, plus the shared atlas Texture001.png.
All of them share one skeleton, so their clips play on each other.

Animation: 7 clips per character @ 30 fps (some characters have more, listed below), each its own named clip:
  Idle | Walk | Run (loops) | Death (play once, hold) | Hit | Attack | Special
  Every character's clips are made for what it holds (one-handed, long weapon, pistol / bow, rifle, its own props). Special:
  SalesRep.glb         office        Special = phone call + 22 more: Talk, Nod, Shake, Shrug, Bow, Wave, Cheer, Think, Point, Sit, Speech, TalkExcited, TalkAngry, TalkAsk, TalkWhisper, TalkSit, WalkTalk, Listen, Call, Text, WalkCall, SitCall
  ItEngineer.glb       office        Special = typing + 21 more: Talk, Nod, Shake, Shrug, Bow, Wave, Cheer, Think, Point, Sit, Speech, TalkExcited, TalkAngry, TalkAsk, TalkWhisper, TalkSit, WalkTalk, Listen, Type, Scratch, SitType
  SecurityGuard.glb    office        Special = radio call + 22 more: Talk, Nod, Shake, Shrug, Bow, Wave, Cheer, Think, Point, Sit, Speech, TalkExcited, TalkAngry, TalkAsk, TalkWhisper, TalkSit, WalkTalk, Listen, Radio, Patrol, Salute, SitRadio
  OfficeIntern.glb     office        Special = serving coffee + 20 more: Talk, Nod, Shake, Shrug, Bow, Wave, Cheer, Think, Point, Sit, Speech, TalkExcited, TalkAngry, TalkAsk, TalkWhisper, TalkSit, WalkTalk, Listen, Serve, Wobble
  Receptionist.glb     office        Special = ringing the bell + 20 more: Talk, Nod, Shake, Shrug, Bow, Wave, Cheer, Think, Point, Sit, Speech, TalkExcited, TalkAngry, TalkAsk, TalkWhisper, TalkSit, WalkTalk, Listen, Ring, Greet
  Accountant.glb       office        Special = calculating + 21 more: Talk, Nod, Shake, Shrug, Bow, Wave, Cheer, Think, Point, Sit, Speech, TalkExcited, TalkAngry, TalkAsk, TalkWhisper, TalkSit, WalkTalk, Listen, Calculate, SitCalc, Scratch
  OfficeManager.glb    office        Special = presenting + 20 more: Talk, Nod, Shake, Shrug, Bow, Wave, Cheer, Think, Point, Sit, Speech, TalkExcited, TalkAngry, TalkAsk, TalkWhisper, TalkSit, WalkTalk, Listen, Present, Explain
  CompanyCeo.glb       office        Special = giving a speech + 21 more: Talk, Nod, Shake, Shrug, Bow, Wave, Cheer, Think, Point, Sit, Speech, TalkExcited, TalkAngry, TalkAsk, TalkWhisper, TalkSit, WalkTalk, Listen, Laugh, Watch, Command
  Play by name — do not slice by frame range.

Three.js quick start:
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  new GLTFLoader().load('SalesRep.glb', (g) => { scene.add(g.scene);
    const mixer = new THREE.AnimationMixer(g.scene);
    mixer.clipAction(THREE.AnimationClip.findByName(g.animations, 'Walk')).play(); });

How to put it in your game
--------------------------
Each .glb holds the whole model: one mesh, its skeleton, its texture and its clips. Y is up, the model faces +Z and
stands on its origin. Sizes are in glTF units (1 unit = 1 metre in Unity, Godot and Unreal); scale each model to the
size your game needs. Play the clips that come with each model, by name.

  Unity     Package Manager > + > Add package by name > com.unity.cloud.gltfast, then drop the .glb into Assets.
            In its Inspector set Animation Method to Mecanim (Animator) or Legacy (Animation); the clips keep their names.
  Godot 4   Drop the .glb into the FileSystem dock and drag it into a scene; the clips are in its AnimationPlayer:
            $AnimationPlayer.play("Walk"). To loop a clip: select the .glb > Import dock > Advanced... > the clip >
            Loop Mode: Linear > Reimport.
  Unreal 5  Drag the .glb into the Content Browser (glTF import is built in). On 5.8 set Skeletal Meshes > Combine
            Skeletal Meshes to "Combine All That Use Same Skeleton".
  Blender   File > Import > glTF 2.0 (.glb/.gltf); the clips are Actions (Dope Sheet > Action Editor).
  Three.js  The quick start above; to make a model h units tall:
            const b = new THREE.Box3().setFromObject(g.scene, true); g.scene.scale.multiplyScalar(h / (b.max.y - b.min.y));

Sizes in the rest pose (height x width x length, units):
  Accountant 0.13 x 0.17 x 0.078  |  CompanyCeo 0.14 x 0.15 x 0.078  |  ItEngineer 0.17 x 0.20 x 0.10
  OfficeIntern 0.15 x 0.17 x 0.12  |  OfficeManager 0.13 x 0.18 x 0.087  |  Receptionist 0.13 x 0.15 x 0.080
  SalesRep 0.14 x 0.21 x 0.094  |  SecurityGuard 0.14 x 0.16 x 0.11

License: CC0 1.0 (public domain) — any use, commercial or personal, no attribution required.
More free CC0 assets: https://gobkit.com/freebies
