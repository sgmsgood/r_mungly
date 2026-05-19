export type AppPage = 'game' | 'settings' | 'help';
export type GameScreen =
  | 'main'
  | 'hungerChoice'
  | 'grid'
  | 'resistTimer'
  | 'chat'
  | 'timerDone'
  | 'urgeCheck'
  | 'urgeStrong'
  | 'urgeLess'
  | 'urgeOkay'
  | 'praiseDone'
  | 'waterDone'
  | 'walkDone'
  | 'resultLog';
export type GameMode = 'food' | 'exercise' | 'shower' | 'rest';
export type FoodCategoryId =
  | 'bunsik'
  | 'chicken'
  | 'chinese'
  | 'pizzaBurger'
  | 'dessert'
  | 'japanese'
  | 'western'
  | 'meat';
export type CharacterId = 'mozzi';
export type MoonglyState =
  | 'waiting'
  | 'proud'
  | 'encouraging'
  | 'tempted'
  | 'relieved'
  | 'comforting'
  | 'happy'
  | 'love'
  | 'satisfied';

export interface CharacterImages {
  basic: string;
  enduring: string;
  happy: string;
  love: string;
}

export interface CharacterDefinition {
  id: CharacterId;
  name: string;
  images: CharacterImages;
}

export interface UserCharacter {
  name: string;
  character: CharacterId;
  createdAt: string;
}

export interface GameItem {
  id: string;
  name: string;
  kcal: string;
  amount?: string;
  category?: FoodCategoryId;
  assetPath?: string;
}

export interface Reaction {
  assetPath?: string;
  key: number;
}

export interface GameState {
  page: AppPage;
  screen: GameScreen;
  currentCharacter: UserCharacter;
  mode: GameMode;
  selectedIndex: number;
  chatChoiceCount: number;
  chatSelectToken: number;
  resistEndsAt: number | null;
  choiceReadyAt: number;
  gridReadyAt: number;
  reaction: Reaction | null;
  moonglyState: MoonglyState;
  moonglyStateBeforeLove: MoonglyState | null;
  moonglyLoveEndsAt: number | null;
  moonglyThought: string | null;
  moonglyThoughtEndsAt: number | null;
  lastFoodIndex: number | null;
  favoriteItemIds: string[];
}
