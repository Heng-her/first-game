---
name: tourism-adventure
description: >-
  Workflows, guidelines, and tool pipelines for the 3D Tourism Adventure Game.
  Covers Diegetic/Realistic UI design (Passport, Paper Map, Brass Compass), procedural
  Blender bpy scripting (headless 3D asset generation), Unreal Engine 5 compatibility,
  reusable clean component architecture, and game flows (Home Page, Stage Selection, Character Selection).
---

# 3D Tourism Adventure Game Skill

This skill guides the development and expansion of the **3D Tourism Adventure Game**, following the core mission, aesthetic standards, and technical rules established in `AGENTS.md`.

---

## 1. Core Principles

- **Primary Goal:** A playable, modular 3D web experience that helps players discover destinations, local culture, nature, food, and activities through fun, interactive gameplay.
- **Language Policy:** All responses, documentation, and user reports must be provided in **Khmer (ភាសាខ្មែរ)**. Code, symbols, and terminal commands remain in English.
- **Clean Code & Reusable Components (កូដមានរបៀបរាបរយ និង Reusable Components):**
  - All UI elements and gameplay features must be modular, strongly typed, and organized into reusable components.
  - Never write monolithic or cluttered components. Separate concerns into `components/ui/common/`, `components/screens/`, `hooks/`, and `types/`.
- **Core Game & UI Flow (លំហូរ UI និងទំព័រហ្គេម):**
  1. **Home Page (ទំព័រដើម):** Welcoming landing/title screen with high aesthetics, play entry, and settings.
  2. **Character Selection (ការជ្រើសរើសតួអង្គ):** Interactive screen to preview and pick avatars (e.g., Khmer traditional style, tourist outfits).
  3. **Stage / Level Selection (ការជ្រើសរើសវគ្គលេង):** Browse tourist destinations and game modes (Angkor Temple, Siem Reap Tuk-Tuk, Tonle Sap Boat, Kulen Nature Trail, Cooking).
  4. **Gameplay Viewport:** Seamless transition into the active 3D stage with Diegetic HUD.
- **Realistic & Diegetic UI (ការរចនា UI បែបរូបរាងជីវិតពិត):**
  - **Travel Guidebook / Tourist Passport (សៀវភៅមគ្គុទ្ទេសក៍ទេសចរណ៍ ឬលិខិតឆ្លងដែន):** For quests, inventory, and stamp collection.
  - **Physical Paper Map & Travel Journal (ផែនទីក្រដាស ឬកូនសៀវភៅកត់ត្រា):** For navigation and landmark history.
  - **Brass Compass & Wooden Signposts (ត្រីវិស័យបុរាណ និងស្លាកសញ្ញាឈើ):** For real-time direction and trail wayfinding.
  - **Realistic Vehicle Dashboards (កុងទ័រ និងផ្ទាំងបញ្ជាយានជំនិះ):** For Tuk-Tuk driving and boat exploration.

---

## 2. Component Organization & Reusability Rules

### Directory Structure Standard:
```text
src/
├── components/
│   ├── ui/
│   │   ├── common/         # Reusable atomic UI: Button, Card, Modal, Badge, ProgressBar
│   │   ├── screens/        # Full-screen flows: HomeScreen, CharacterSelectScreen, StageSelectScreen
│   │   └── diegetic/       # Real-world styled UI: PassportBook, BrassCompass, PaperMap
│   └── game/               # 3D Canvas, Scenes, Characters, Cameras, Controls
├── hooks/                  # Reusable React hooks (keyboard, audio, persistence)
├── types/                  # Typed interfaces for screens, characters, stages, inventory
└── utils/                  # Audio FX, math, camera helpers
```

### Reusability Checklist:
1. **Generic Props:** Avoid hardcoding specific text, colors, or icons inside low-level buttons, cards, or dialogs.
2. **Explicit Interfaces:** Every reusable component must define a TypeScript `interface Props`.
3. **Compound & Composable:** Build complex screens by composing atomic reusable pieces.

---

## 3. UI Flow State Architecture

The main game state flow should be driven by a clear, typed state machine:

```typescript
export type GameScreen = 
  | 'HOME'               // Home page / title menu
  | 'CHARACTER_SELECT'   // Character selection screen
  | 'STAGE_SELECT'       // Destination & level selection screen
  | 'PLAYING'            // In-game 3D exploration
  | 'PAUSED'             // Pause overlay
  | 'PASSPORT';          // Diegetic Guidebook / Passport view
```

Transitions should be fluid, allowing the player to return to previous menus cleanly and preserve selections.

---

## 4. 3D Asset Automation via Blender Python (`bpy`)

When generating 3D models (characters, vehicles, props, or UI textures), use headless Blender scripting:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background --python <path_to_script.py>
```

### Export Standards:
- Export `.glb` / `.gltf` to `public/models/` for browser WebGL runtime.
- Preserve master `.blend` or `.fbx` for high-fidelity Unreal Engine 5 Nanite pipelines.
- Unit scale: `1 unit = 1 meter`.

---

## 5. Diegetic UI Guidelines

When building or updating UI:
1. **Tangible Materials:** Use skeuomorphic visual styling (leather grain, gold foil embossing, parchment texture, ink stamp opacity, brass metallic highlights).
2. **Dynamic Feedback:** Connect real-time game state (player position, rotation, collected items) directly to diegetic indicators (compass needle angle, stamp count, page completion).
3. **Responsive & Accessible:** Ensure touch controls, keyboard navigation, and responsive scaling operate cleanly on mobile and desktop without obstructing the 3D viewport.
