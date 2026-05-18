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
export type CharacterId = 'mozzi';
export type MoonglyState =
  | 'waiting'
  | 'proud'
  | 'encouraging'
  | 'tempted'
  | 'relieved'
  | 'comforting'
  | 'happy'
  | 'satisfied';

export interface CharacterImages {
  basic: string;
  enduring: string;
  happy: string;
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
  emoji: string;
  kcal: string;
  assetPath?: string;
}

export interface Reaction {
  emoji: string;
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
  moonglyThought: string | null;
  moonglyThoughtEndsAt: number | null;
  lastFoodIndex: number | null;
}
