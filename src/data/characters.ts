import type { CharacterOption } from "../types/game";

export const CHARACTERS_DATA: CharacterOption[] = [
  {
    id: "ch_dara",
    nameKm: "តារា",
    nameEn: "Dara",
    roleKm: "អ្នកផ្សងព្រេងក្នុងស្រុក",
    roleEn: "Local Explorer",
    descriptionKm: "យុវជនស្រឡាញ់ការដើរព្រៃ និងរុករកប្រាសាទបុរាណ មានភាពស្វាហាប់ និងរហ័សរហួនគ្រប់ស្ថានភាព។",
    descriptionEn: "Energetic local adventurer passionate about temple exploration and nature trekking.",
    avatarIcon: "🧑‍🌾",
    modelPath: "/models/characters/Kiss.glb",
    features: ["រត់លឿន និងស្ទុះល្អ", "ស្គាល់ផ្លូវកាត់អង្គរ", "ពាក់ក្រមាប្រពៃណីខ្មែរ"],
    badgeKm: "ពេញនិយម (Favorite)",
    badgeEn: "Popular",
    accentColor: "#f59e0b",
    stats: {
      speed: 85,
      stamina: 90,
      knowledge: 80,
    },
    isUnlocked: true,
  },
  {
    id: "ch_bopha",
    nameKm: "បុប្ផា",
    nameEn: "Bopha",
    roleKm: "មគ្គុទ្ទេសក៍ទេសចរណ៍វប្បធម៌",
    roleEn: "Heritage Tour Guide",
    descriptionKm: "អ្នកជំនាញប្រវត្តិសាស្រ្ត និងវប្បធម៌ខ្មែរ ពូកែអានផែនទីបុរាណ និងស្វែងរកកំណប់ដែលកប់ទុក។",
    descriptionEn: "Cultural expert with deep knowledge of ancient Khmer history and hidden relics.",
    avatarIcon: "👩‍💼",
    modelPath: "/models/characters/Kiss.glb",
    features: ["ពូកែរកកំណប់បុរាណ", "ចំណេះដឹងប្រវត្តិសាស្ត្រខ្ពស់", "ប្រមូលកាក់រង្វាន់ទ្វេដង (+20%)"],
    badgeKm: "វប្បធម៌ (Heritage)",
    badgeEn: "Culture",
    accentColor: "#ec4899",
    stats: {
      speed: 75,
      stamina: 82,
      knowledge: 98,
    },
    isUnlocked: true,
  },
  {
    id: "ch_samnang",
    nameKm: "សំណាង",
    nameEn: "Samnang",
    roleKm: "អ្នកបើកបរកង់បីជំនាញ",
    roleEn: "Pro Remork Driver",
    descriptionKm: "អ្នកបើកបរ Tuk-Tuk ដ៏ប៉ិនប្រសប់ ប្រចាំក្រុងសៀមរាប ស្គាល់រាល់ផ្លូវកែង និងទិសដៅទេសចរណ៍ទាំងអស់។",
    descriptionEn: "Skillful Cambodian Tuk-Tuk driver knowing every route and tourist shortcut in Siem Reap.",
    avatarIcon: "🛺",
    modelPath: "/models/characters/Kiss.glb",
    features: ["គ្រប់គ្រងចង្កូតកង់បីស្ទាត់", "ល្បឿនយានជំនិះ +15%", "គេចឧបសគ្គផ្លូវបានលឿន"],
    badgeKm: "អ្នកបើកបរ (Driver)",
    badgeEn: "Specialist",
    accentColor: "#06b6d4",
    stats: {
      speed: 95,
      stamina: 85,
      knowledge: 85,
    },
    isUnlocked: true,
  },
  {
    id: "ch_sokha",
    nameKm: "សុខា",
    nameEn: "Sokha",
    roleKm: "អ្នករុករកធម្មជាតិភ្នំគូលែន",
    roleEn: "Kulen Nature Scout",
    descriptionKm: "អ្នករុករកព្រៃឈើ និងទឹកជ្រោះធម្មជាតិ ធន់នឹងការធ្វើដំណើរផ្លូវឆ្ងាយ និងស្រឡាញ់បរិស្ថានបៃតង។",
    descriptionEn: "Resilient nature trail scout passionate about waterfalls, wildlife and forest preservation.",
    avatarIcon: "🧭",
    modelPath: "/models/characters/Kiss.glb",
    features: ["ស្គាល់រុក្ខជាតិ និងទឹកជ្រោះ", "ថាមពលរត់ផ្លូវឆ្ងាយខ្ពស់", "រង្វាន់ពិសេសពេលរុករកព្រៃ"],
    badgeKm: "ធម្មជាតិ (Eco Scout)",
    badgeEn: "Nature",
    accentColor: "#10b981",
    stats: {
      speed: 88,
      stamina: 96,
      knowledge: 86,
    },
    isUnlocked: true,
  },
];

const LOCAL_STORAGE_KEY = "cambodia_tour_active_character_id";

export function getActiveCharacter(): CharacterOption {
  if (typeof window === "undefined") return CHARACTERS_DATA[0];
  try {
    const savedId = localStorage.getItem(LOCAL_STORAGE_KEY);
    const found = CHARACTERS_DATA.find((c) => c.id === savedId);
    return found || CHARACTERS_DATA[0];
  } catch {
    return CHARACTERS_DATA[0];
  }
}

export function setActiveCharacterId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}
