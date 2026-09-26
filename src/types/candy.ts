/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CandyColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';

export type SpecialType = 'normal' | 'striped_h' | 'striped_v' | 'wrapped' | 'color_bomb';

export type IngredientType = 'cherry' | 'nut';

export interface Candy {
  id: string;
  color: CandyColor;
  special: SpecialType;
  isIngredient?: IngredientType;
  matched?: boolean;
}

export interface Tile {
  row: number;
  col: number;
  candy: Candy | null;
  jelly: number; // 0 = none, 1 = single jelly, 2 = double jelly
  frosting: number; // 0 = none, 1 = single frosting, 2 = double frosting
  chocolate: boolean; // true = chocolate block on tile
}

export interface LevelConfig {
  id: number;
  name: string;
  chapter: string;
  description: string;
  rows: number;
  cols: number;
  maxMoves: number;
  colors: CandyColor[];
  targetScore: number;
  starScores: [number, number, number];
  targetJelly?: number;
  targetFrosting?: number;
  targetIngredients?: {
    type: IngredientType;
    required: number;
  };
  initialJellyTiles?: [number, number][]; // [row, col]
  initialFrostingTiles?: [number, number, number][]; // [row, col, layer]
  initialChocolateTiles?: [number, number][]; // [row, col]
  ingredientSpawnCols?: number[];
  initialIngredientsCount?: number;
  difficulty?: 'Normal' | 'Hard' | 'Super Hard' | 'Nightmare';
}

export type BoosterType = 'hammer' | 'switch' | 'bomb' | 'shuffle';

export interface BoosterState {
  hammer: number;
  switch: number;
  bomb: number;
  shuffle: number;
}

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color?: string;
  fontSize?: string;
}

export interface ComboBanner {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}

export interface GameStats {
  score: number;
  movesRemaining: number;
  jellyCleared: number;
  totalJelly: number;
  frostingCleared: number;
  totalFrosting: number;
  ingredientsDelivered: number;
  totalIngredients: number;
  stars: number;
  combosCount: number;
}

// Graphics & Performance settings
export type DeviceRam = 1 | 2 | 3 | 4 | 6 | 8 | 16 | 32;

export type GraphicsPreset = 
  | 'very_low'    // 1GB-2GB (Disables particles, fast CSS, no blur, safe for low-end)
  | 'low'         // 2GB-3GB
  | 'medium'      // 3GB-4GB
  | 'ultra_medium'// 4GB-6GB
  | 'very_high'   // 6GB+ RAM
  | 'extreme'     // 8GB+ RAM (Full dynamic glow, screen shake, heavy particles)
  | 'extreme_plus';// 16GB-32GB RAM (Max cinema visuals, light trails, ultra 120fps feel)

export interface GraphicsSetting {
  id: GraphicsPreset;
  name: string;
  hindiName: string;
  minRam: DeviceRam;
  description: string;
  badge?: string;
  particleLimit: number;
  allowBlur: boolean;
  allowScreenShake: boolean;
  candyGleam: boolean;
}

export interface UserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  voiceChimes: boolean;
  soundVolume: number;
  musicVolume: number;
  deviceRam: DeviceRam;
  graphicsPreset: GraphicsPreset;
  vibrationEnabled?: boolean;
}

export interface ShopPackage {
  id: string;
  name: string;
  price: number; // in USD: 100, 400, 470, 750, 890, 999, 1000, 2500, 100000 ($100k), 280000 ($280k), 400000 ($400k), 490000 ($490k)
  goldBars: number;
  hammers: number;
  switches: number;
  bombs: number;
  shuffles: number;
  unlimitedLivesHours: number;
  hasPass?: boolean;
  passTier?: 'Gold' | 'Royal' | 'Emperor' | 'Celestial' | 'Lifetime' | 'Mythic' | 'Titan' | 'Sovereign' | 'Omnipotent';
  isOneTimeLifetime?: boolean;
  badge?: string;
  popular?: boolean;
  isComingSoon?: boolean;
  comingSoonText?: string;
  oneTimeOnly?: boolean;
}

// Daily Login Reward
export interface DailyRewardState {
  lastClaimDate: string; // YYYY-MM-DD
  streak: number; // 1 to 7
  hasClaimedToday: boolean;
}

// Daily Task (English language only)
export interface DailyTask {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  rewardGold: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

// Player Profile & Anti-Cheat Fair Play Bio
export interface PlayerProfile {
  playerId: string;
  username: string;
  bio: string;
  avatar: string;
  isBanned: boolean;
  banReason?: string;
  antiCheatStatus: 'Clean & Verified' | 'Cheat Detected' | 'Account Suspended';
  fairPlayAcknowledged: boolean;
}

// Daily Lucky Wheel Mini-Game
export interface LuckyWheelReward {
  id: string;
  name: string;
  gold: number;
  hammers: number;
  switches: number;
  bombs: number;
  shuffles: number;
  icon: string;
  color: string;
  textColor: string;
}

export interface LuckyWheelState {
  lastSpinDate: string; // YYYY-MM-DD
  hasSpunToday: boolean;
}
