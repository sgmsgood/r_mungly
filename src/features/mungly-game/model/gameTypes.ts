export type AppPage = 'game' | 'settings';
export type GameScreen = 'main' | 'hungerChoice' | 'grid' | 'resistTimer';
export type GameMode = 'food' | 'exercise' | 'shower' | 'rest';

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
  mode: GameMode;
  selectedIndex: number;
  resistEndsAt: number | null;
  choiceReadyAt: number;
  gridReadyAt: number;
  reaction: Reaction | null;
  munglyThought: string | null;
  munglyThoughtEndsAt: number | null;
  lastFoodIndex: number | null;
}
