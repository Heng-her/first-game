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
