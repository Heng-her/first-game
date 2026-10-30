export interface CharacterOption {
  id: string;
  nameKm: string;
  nameEn: string;
  roleKm: string;
  roleEn: string;
  descriptionKm: string;
  descriptionEn: string;
  avatarIcon: string;
  modelPath: string;
  features: string[];
  badgeKm?: string;
  badgeEn?: string;
  accentColor?: string;
  stats?: {
    speed: number;
    stamina: number;
    knowledge: number;
  };
  isUnlocked?: boolean;
}

export interface StageOption {
  id: string;
  nameKm: string;
  nameEn: string;
  locationKm: string;
  locationEn: string;
  category: "treasure" | "driving" | "boat" | "trail" | "cooking";
  descriptionKm: string;
  descriptionEn: string;
  thumbnail: string;
  difficultyKm: string;
  durationKm: string;
  isUnlocked: boolean;
  totalCoins?: number;
}

