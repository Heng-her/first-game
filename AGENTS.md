# AGENTS.md — 3D Tourism Adventure Game

## 1. Mission

Build a browser-based 3D tourism adventure game that helps players discover destinations, local culture, nature, food, and activities through fun, interactive gameplay.

The game may offer several modes inside one coherent product. Do not reduce the project to a fish-shooting game, a generic website, or a static virtual tour.

**Primary goal:** create a playable, modular 3D experience that can grow over time without mixing every activity into one large, fragile implementation.

This file defines the agent's working rules and product direction. It is not a request to implement every feature at once.

## 2. Core Gameplay Modes

Treat each mode as a distinct gameplay module that shares the same player profile, progression, rewards, UI design system, and world/destination data where appropriate.

### A. Treasure Hunt and Coin Collection
- Players explore a clearly bounded destination or level.
- Place collectible coins, clues, artifacts, and optional hidden rewards.
- Provide a quest objective, progress counter, and clear completion feedback.
- Make collectibles discoverable through exploration rather than placing everything randomly.
- Use coins as **in-game, non-cash rewards** unless the product owner explicitly defines a compliant alternative.
- Avoid real-money wagering, gambling mechanics, or misleading reward claims.
- Support level boundaries, checkpoints, respawning, and quest completion states.

### B. Running and Exploration
- Allow players to run or walk through defined environments.
- Example environments: temple grounds, town streets, jungle trails, parks, and nature paths.
- Include movement controls, collision, camera behavior, and simple environmental interaction.
- Use plants, rocks, signs, landmarks, and paths to make each area recognizable and navigable.
- Do not imply that a simplified game map is an exact real-world navigation tool.

### C. Tuk-Tuk / Remork Driving
- Let players ride a Cambodian tuk-tuk/remork along designed roads.
- Include steering, acceleration, braking, camera follow, collision, and route checkpoints.
- Add tourism-themed missions such as reaching a landmark, collecting tokens, or completing a scenic route.
- Start with an arcade-style driving model; do not overbuild realistic vehicle physics before the basic loop is fun.
- Respect local visual context and avoid presenting fictional roads or traffic rules as authoritative travel guidance.

### D. Boat Exploration
- Let players travel by boat along a river, lake, or coastline.
- Support steering, speed control, shoreline boundaries, checkpoints, and collectibles.
- Design separate environment presets for rivers, lakes, and coastal areas.
- Add scenery such as water, vegetation, boats, docks, islands, and destination landmarks as appropriate.
- Keep water effects and environmental assets performant on common devices.

### E. Forest and Nature Trail
- Let players run or explore through forest paths and natural areas.
- Use varied vegetation, trees, flowers, rocks, water, wildlife, and trail markers.
- Provide exploration objectives, nature discoveries, collectible items, or simple educational facts.
- Avoid excessive vegetation density that harms frame rate or blocks the playable route.
- Use factual, reviewed content for real species or environmental claims.

### F. Cooking Lessons and Courses
- Create a course-based cooking activity inspired by local cuisine.
- Organize lessons into courses, lessons, steps, ingredients, and completion states.
- Example flow: choose a course → select a dish → review ingredients → follow preparation steps → complete a simple timed or interactive task → receive feedback and a badge.
- Make cooking interaction understandable with clear prompts, step indicators, and accessible controls.
- Separate educational instructions and ingredient data from presentation components.
- Treat recipes and food-safety guidance carefully; do not invent cultural claims or unsafe cooking instructions.
- Cooking lessons may use a dedicated 3D kitchen scene, or a simpler interactive scene if full 3D adds little value.

## 3. Shared Game Systems

Prefer reusable systems that multiple modes can use:
- Player profile and local/session progress.
- Input mapping for keyboard, mouse, and touch.
- Third-person or first-person camera controller, selected to fit the mode.
- Interactions and object highlighting.
- Quest/objective tracking.
- Collectibles, in-game currency, XP, badges, and achievements.
- Level/destination loading and spawn points.
- Pause, resume, settings, sound, and help overlays.
- Loading, empty, success, failure, and retry states.
- Localization-ready text (at minimum, design so Khmer and English can be added).
- Accessibility options such as adjustable sensitivity, readable UI, and control hints.

Do not force all modes to share identical controls or camera behavior. Reuse common infrastructure while allowing mode-specific gameplay.

## 4. Product and UX Principles

- The 3D world is the main experience; UI should support it without covering too much of the screen.
- Use a clear hierarchy: objective, progress/reward, essential controls, and pause/settings.
- **Realistic & Diegetic UI (ការរចនា UI បែបរូបរាងជីវិតពិត):**
  - រចនា UI ឱ្យមានទម្រង់ជាវត្ថុប្រើប្រាស់ជាក់ស្តែងក្នុងជីវិតពិត (Tangible & Skeuomorphic / Diegetic UI) ជៀសវាងផ្ទាំង 2D Flat HUD ធម្មតា ដើម្បីបង្កើនភាពរស់រវើក និងទាក់ទាញអារម្មណ៍ទេសចរណ៍៖
    - **សៀវភៅមគ្គុទ្ទេសក៍ទេសចរណ៍ ឬលិខិតឆ្លងដែន (Travel Guidebook / Tourist Passport):** សម្រាប់បើកមើល Quest, Inventory, និងប្រមូលត្រាអនុស្សាវរីយ៍ (Stamp Collection) នៃតំបន់ទេសចរណ៍នីមួយៗ។
    - **ផែនទីក្រដាស ឬកូនសៀវភៅកត់ត្រា (Physical Paper Map & Travel Journal):** សម្រាប់រុករកទិសដៅ ចំណុចសំខាន់ និងប្រវត្តិទីតាំង។
    - **ត្រីវិស័យបុរាណ និងស្លាកសញ្ញាឈើ (Brass Compass & Wooden Signposts):** សម្រាប់ចង្អុលបង្ហាញទិសដៅ និងផ្លូវធ្វើដំណើរក្នុងធម្មជាតិ ឬប្រាសាទ។
    - **កុងទ័រ និងផ្ទាំងបញ្ជាយានជំនិះជាក់ស្តែង (Realistic Vehicle Dashboards):** សម្រាប់ម៉ូដបើកបរកង់បី (Tuk-Tuk) និងទូក ដែលមាននាឡិកាល្បឿន ចង្កូត និងភ្លើងសញ្ញាដូចយានជំនិះពិត។
    - **ឧបករណ៍ស្មាតហ្វូនទេសចរណ៍ (Travel Smart Device / Camera):** សម្រាប់មុខងារថតរូបអនុស្សាវរីយ៍ (Photo Mode) និងស្កេនព័ត៌មានវប្បធម៌។
- Keep the interface simple, readable, and consistent across modes.
- Provide short onboarding instructions the first time a mode is played.
- Make keyboard and touch controls discoverable; never rely on color alone to communicate status.
- Provide a clear way to return to the mode selector or destination hub.
- Show progress and rewards honestly. Do not imply that game rewards are real money, discounts, tickets, or prizes unless a real, verified system exists.
- For tourism content, distinguish verified real-world facts from fictional story elements.
- Use licensed, original, or appropriately permitted 3D models, textures, audio, and fonts. Track asset sources and licenses.
- Do not copy proprietary game UI, maps, characters, or assets.

## 5. Technical and Architecture Rules

1. **Inspect first.** Before changing files, inspect the repository, package manager, framework, routing, existing components, tests, and asset pipeline.
2. **Reuse first.** Search for existing systems and components before creating replacements.
3. **Respect the existing stack.** If the repository is already configured, do not replace its framework or build setup without a clear reason and explicit approval.
4. If starting from an empty repository, propose a small, browser-friendly 3D stack and explain the trade-offs before installing packages. A possible option is React + TypeScript + Three.js/React Three Fiber; Vue + TypeScript + Three.js is also valid.
5. Keep gameplay logic separate from UI and rendering where practical. Use clear modules for player input, movement, camera, interactions, quests, collectibles, environment configuration, and each gameplay mode.
6. Use typed data models for destinations, levels, quests, collectibles, cooking courses, lessons, recipes, and rewards.
7. Keep each mode independently testable and loadable. Avoid a single giant scene/component containing every game mode.
8. Do not add a backend, database, accounts, multiplayer, payments, or analytics until the requested playable scope requires them.
9. Do not claim that a visual mockup is a playable game. Wire controls and state to real behavior, or clearly label what is only a placeholder.
10. Optimize for browser performance: reuse geometry/materials where suitable, dispose of resources correctly, limit expensive real-time effects, and test realistic asset counts.
11. Handle loading failures, missing assets, invalid level data, and restart/exit behavior gracefully.
12. Keep secrets out of frontend code and never trust client-reported scores or rewards if a future backend stores competitive progress.

## 6. Implementation Workflow

For every task, follow this sequence:

### Step 1 — Read-only audit
- Inspect project structure and current implementation.
- Identify relevant routes, scenes, components, types, assets, and tests.
- Search for duplicate or reusable functionality.
- Check existing conventions and dependencies.

### Step 2 — Classify the change
State which approach applies:
- **REUSE EXISTING**
- **EXTEND EXISTING**
- **REFACTOR EXISTING**
- **CREATE NEW**

### Step 3 — Plan a small change
- Restate the requested outcome.
- List the smallest set of files/modules likely to change.
- Identify dependencies, risks, and how the result will be verified.
- Ask a concise question and stop if a key requirement is ambiguous or conflicts with existing architecture.

### Step 4 — Implement incrementally
- Work on one mode or one gameplay loop at a time.
- Prefer a small playable vertical slice over many unfinished screens.
- Do not generate every mode in one pass unless explicitly requested.
- Avoid unnecessary abstractions, duplicated state, and unrelated refactors.
- Preserve existing behavior unless the task explicitly changes it.

### Step 5 — Verify
Run the relevant available checks, such as type checking, linting, unit tests, and production build. For 3D behavior, also verify scene loading, movement, collision/interactions, restart/exit, resizing, and keyboard/touch input where feasible.
- Do not claim a check passed unless it was actually run.
- If a check cannot be run, report why and what remains unverified.

### Step 6 — Report
Always provide a concise before/after report:
- **Changed:** files and behavior changed.
- **Reused:** existing components/systems reused.
- **New:** new modules/assets/dependencies, if any.
- **Issues found:** bugs, risks, missing assets, or assumptions.
- **Verification:** commands/checks actually run and their results.
- **Next step:** one sensible next task, not a huge unrelated roadmap.

## 7. Scope and Safety Guardrails

- Do not over-engineer or build features the user did not request.
- Keep changes focused; normally touch 1–3 files for a small task unless the architecture genuinely requires more. Explain larger change sets before proceeding.
- Do not overwrite existing work blindly or create a parallel implementation of an existing feature.
- Do not add paid services or dependencies without explaining the need.
- Do not fabricate tourism facts, landmarks, opening hours, travel advice, or cultural claims.
- Use placeholder data only when clearly labeled as sample content.
- Ask before implementing real-money purchases, cash-out, gambling, user tracking, or collection of sensitive personal data.
- Keep the game welcoming to international visitors and local players. Plan for Khmer and English localization without hardcoding UI text throughout gameplay logic.

## 8. Recommended Build Order

Do not build all modes at once. Use this order unless the user requests another:
1. A small 3D destination hub with movement, camera, and a return/menu flow.
2. One complete treasure-hunt loop: objective → explore → collect → progress feedback → completion/retry.
3. Reusable level and collectible data structures.
4. One running/forest exploration level.
5. One tuk-tuk driving prototype.
6. One boat exploration prototype.
7. One cooking course with multiple steps and completion feedback.
8. Shared progression, localization, save/load, and additional destinations.
9. Backend, accounts, leaderboards, or multiplayer only when explicitly needed.

Each mode should have a clear “minimum playable version” before adding polish.

## 9. Definition of Done

A feature is complete only when:
- The requested interaction works, not just its visual representation.
- Controls and instructions are clear.
- Success, failure, restart, and exit states are handled where relevant.
- The feature works with the existing architecture and does not duplicate existing systems.
- Type checking, relevant tests, and build checks have been run when available.
- Any missing assets, limitations, and unverified behavior are documented.

## 10. Agent Communication & Language Rules (ច្បាប់ទំនាក់ទំនង និងភាសារបស់ Agent)

- **ភាសាក្នុងការឆ្លើយតប (Response Language):** រាល់ការឆ្លើយតប ការពន្យល់ និងរបាយការណ៍ទាំងអស់ទៅកាន់អ្នកប្រើប្រាស់ ត្រូវតែធ្វើឡើងជាភាសាខ្មែរ (Khmer language)។
- **ពាក្យបច្ចេកទេស និងកូដ (Technical Terms & Code):** ឈ្មោះឯកសារ កូដ ពាក្យបញ្ជា (commands) និងពាក្យបច្ចេកទេសទូទៅ អាចរក្សាទុកជាភាសាអង់គ្លេស ឬសរសេរអមជាមួយការពន្យល់ជាភាសាខ្មែរ ដើម្បីភាពច្បាស់លាស់។
- **របាយការណ៍ការងារ (Workflow Reporting):** ការរាយការណ៍តាមជំហាន (ដូចជា Step 6 — Report) ត្រូវតែបង្ហាញជាភាសាខ្មែរ។

## 11. 3D Scripting APIs & Tool Integration (បំពង់បង្ហូរការងារ 3D Scripting ជាមួយ Blender `bpy` & Unreal Engine)

ដើម្បីធានាថាក្រាហ្វិក UI និងទ្រព្យសម្បត្តិ 3D (3D Assets) មានរូបរាងស្អាត និងរស់រវើកដូចជីវិតពិត ត្រូវអនុវត្តតាមគោលការណ៍បច្ចេកវិទ្យាដូចខាងក្រោម៖

### ក. ការបង្កើត 3D Asset & Diegetic UI ដោយស្វ័យប្រវត្តិតាមរយៈ Blender Python API (`bpy`)
1. **ស្វ័យប្រវត្តិកម្មកូដ (Procedural Scripting):**
   - ប្រើប្រាស់ Python Scripts (`bpy`) ក្នុងការបង្កើតម៉ូដែល 3D (តួអង្គ, យានជំនិះ Tuk-Tuk, ទូក, និង UI ដូចជីវិតពិតដូចជា កូនសៀវភៅ Passport, ត្រីវិស័យ, ផ្ទាំងកុងទ័រ)។
   - ដំណើរការ Blender ក្នុងទម្រង់ Background (Headless) តាមរយៈ Command-Line៖
     ```powershell
     & "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background --python <path_to_script.py>
     ```
2. **ការនាំចេញ (Export Pipeline):**
   - នាំចេញដោយស្វ័យប្រវត្តិជាទម្រង់ `.glb` / `.gltf` ទៅកាន់ `public/models/` នៃគម្រោង Web Game។
   - កំណត់ PBR Materials, UV Mapping, និង Origin Point ឱ្យបានត្រឹមត្រូវ (Z-up ឬ Y-up តាមស្តង់ដារ Three.js) និងធ្វើ Optimization (Poly count សមរម្យសម្រាប់ WebGL)។

### ខ. ការត្រៀមខ្លួនសម្រាប់ Unreal Engine 5 (High-Fidelity & Cinematic Pipeline)
1. **ស្តង់ដាររួម (Unified Standards):**
   - រក្សាខ្នាត (Unit Scale) ស្តង់ដារ៖ `1 unit = 1 meter` ឬ `1 unit = 1 cm` ឱ្យស៊ីគ្នាជាមួយទាំង Three.js និង Unreal Engine។
   - រចនារចនាសម្ព័ន្ធទិន្នន័យ (Data Schemas) សម្រាប់ Destination, Quests, និង Cooking Recipes ដោយឡែកពី Render Layer ដើម្បីអាចយក Logic ទាំងនេះទៅប្រើក្នុង Unreal Engine 5 C++ / Blueprints បានដោយផ្ទាល់។
2. **កម្រិតក្រាហ្វិកកំពូល (Nanite & Lumen Compatibility):**
   - សម្រាប់ម៉ូដែលចម្លាក់លម្អិតកម្រិតខ្ពស់ (High-poly Sculpt) នៅក្នុង Blender ត្រូវរក្សាទុកឯកសារមេ (Master `.blend` ឬ High-res `.fbx` / `.usd`) សម្រាប់ប្រើជាមួយ Unreal Engine 5 Nanite ខណៈពេលដែល export កំណែស្រាល (`.glb`) សម្រាប់ Three.js Web Game។



## 12. ស្ថាបត្យកម្មកូដស្អាត និង Reusable Component Architecture (Clean Code & Modularity)

1. **កូដមានរបៀបរាបរយ (Clean & Well-Organized Code):**
   - កូដទាំងអស់ត្រូវតែរៀបចំជាម៉ូឌុល (Modularized) មិនសរសេរកូដគរគ្នាក្នុង file តែមួយឡើយ (ជៀសវាង Giant Monolithic Files)។
   - បែងចែក Component តាមកម្រិតតួនាទីច្បាស់លាស់៖
     - `src/components/ui/common/`: Reusable Atomic Components (ប៊ូតុង Button, កាត Card, ប្រអប់សារ Modal/Dialog, ផ្លាក Badge, របារ ProgressBar)។
     - `src/components/ui/screens/`: ផ្ទាំងពេញអេក្រង់ (HomeScreen, CharacterSelectScreen, StageSelectScreen)។
     - `src/components/ui/diegetic/`: UI បែបរូបរាងជីវិតពិត (PassportBook, BrassCompass, PaperMap)។
     - `src/components/game/`: ផ្នែក Canvas 3D, តួអង្គ, កាមេរ៉ា, និងបរិស្ថាន។
2. **ការបង្កើត Component សម្រាប់ Reusability:**
   - រាល់ reusable component ត្រូវកំណត់ Typed Props (TypeScript Interface) ច្បាស់លាស់ អាចទទួល props បត់បែនតាមតម្រូវការ (Flexible & Generic)។
   - ជៀសវាងការចង string ឬពណ៌ជាប់រឹង (Hardcoded) នៅក្នុង component តូចៗ។

## 13. ស្តង់ដារ UI & Game Screen Flow (លំហូរផ្ទាំងបញ្ជា និងវគ្គលេង)

គម្រោងត្រូវមាន Game State Flow យ៉ាងច្បាស់លាស់ដើម្បីសម្រួលដល់បទពិសោធន៍អ្នកលេង៖
1. **Home Page (ទំព័រដើម):**
   - បង្ហាញចំណងជើងហ្គេម ទេសភាពស្វាគមន៍ (Hero Backdrop / Angkor visual) ប៊ូតុងចាប់ផ្តើមលេង (Start / Play Adventure) ប៊ូតុង Settings និងព័ត៌មានអំពីហ្គេម។
2. **Character Selection (ការជ្រើសរើសតួអង្គ):**
   - ផ្ទាំងមើល និងជ្រើសរើសតួអង្គ (ឧ. តួអង្គប្រុស/ស្រី សម្លៀកបំពាក់បែបប្រពៃណីខ្មែរ ឬភ្ញៀវទេសចរ) ព្រមទាំងបង្ហាញលក្ខណៈពិសេស ឬព័ត៌មានសង្ខេបរបស់តួអង្គ។
3. **Stage / Level Selection (ការជ្រើសរើសវគ្គលេង):**
   - ផ្ទាំងជ្រើសរើសវគ្គទេសចរណ៍ និងរបៀបលេង (ឧទាហរណ៍៖ រុករកប្រាសាទបុរាណ Angkor Treasure Hunt, បើកបរកង់បី Siem Reap Tuk-Tuk, ជិះទូកលើបឹងទន្លេសាប Tonle Sap Boat, ដើរព្រៃភ្នំគូលែន Kulen Nature Trail)។
4. **Gameplay Screen & Diegetic UI:**
   - ដំណើរការចូលទៅកាន់វគ្គដែលបានជ្រើសរើស ជាមួយតួអង្គដែលបានជ្រើសរើស ដោយភ្ជាប់ជាមួយ Diegetic HUD (លិខិតឆ្លងដែន Passport / ត្រីវិស័យ Brass Compass) និងប៊ូតុងត្រឡប់មកកាន់ Menu វិញគ្រប់ពេលវេលា។
