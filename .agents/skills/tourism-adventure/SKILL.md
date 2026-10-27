---
name: tourism-adventure
description: >-
  Workflows, guidelines, and tool pipelines for the 3D Tourism Adventure Game.
  Covers Diegetic/Realistic UI design (Passport, Paper Map, Brass Compass), procedural
  Blender bpy scripting (headless 3D asset generation), Unreal Engine 5 compatibility,
  and adventure gameplay modes (Treasure Hunt, Tuk-Tuk, Boat, Cooking).
---

# 3D Tourism Adventure Game Skill

This skill guides the development and expansion of the **3D Tourism Adventure Game**, following the core mission, aesthetic standards, and technical rules established in `AGENTS.md`.

---

## 1. Core Principles

- **Primary Goal:** A playable, modular 3D web experience that helps players discover destinations, local culture, nature, food, and activities through fun, interactive gameplay.
- **Language Policy:** All responses, documentation, and user reports must be provided in **Khmer (ភាសាខ្មែរ)**. Code, symbols, and terminal commands remain in English.
- **Realistic & Diegetic UI (ការរចនា UI បែបរូបរាងជីវិតពិត):**
  - **Travel Guidebook / Tourist Passport (សៀវភៅមគ្គុទ្ទេសក៍ទេសចរណ៍ ឬលិខិតឆ្លងដែន):** For quests, inventory, and stamp collection.
  - **Physical Paper Map & Travel Journal (ផែនទីក្រដាស ឬកូនសៀវភៅកត់ត្រា):** For navigation and landmark history.
  - **Brass Compass & Wooden Signposts (ត្រីវិស័យបុរាណ និងស្លាកសញ្ញាឈើ):** For real-time direction and trail wayfinding.
  - **Realistic Vehicle Dashboards (កុងទ័រ និងផ្ទាំងបញ្ជាយានជំនិះ):** For Tuk-Tuk driving and boat exploration.

---

## 2. 3D Asset Automation via Blender Python (`bpy`)

When generating 3D models (characters, vehicles, props, or UI textures), use headless Blender scripting:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background --python <path_to_script.py>
```

### Export Standards:
- Export `.glb` / `.gltf` to `public/models/` for browser WebGL runtime.
- Preserve master `.blend` or `.fbx` for high-fidelity Unreal Engine 5 Nanite pipelines.
- Unit scale: `1 unit = 1 meter`.

---

## 3. Diegetic UI Guidelines

When building or updating UI:
1. **Tangible Materials:** Use skeuomorphic visual styling (leather grain, gold foil embossing, parchment texture, ink stamp opacity, brass metallic highlights).
2. **Dynamic Feedback:** Connect real-time game state (player position, rotation, collected items) directly to diegetic indicators (compass needle angle, stamp count, page completion).
3. **Responsive & Accessible:** Ensure touch controls, keyboard navigation, and responsive scaling operate cleanly on mobile and desktop without obstructing the 3D viewport.
