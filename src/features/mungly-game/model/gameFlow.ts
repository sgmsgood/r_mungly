import type { GameMode, GameState } from './gameTypes';

const INPUT_LOCK_MS = 300;
const RESIST_DURATION_MS = 10 * 60 * 1000;
const FOOD_CHOICE_COUNT = 2;

export const MAIN_MODES: GameMode[] = ['food', 'rest'];

type GamePatch = Partial<GameState>;

function getLoopedIndex(index: number, length: number) {
  return (index + length) % length;
}

export function getPreviousMainMode(mode: GameMode): GameMode {
  const index = MAIN_MODES.indexOf(mode);
  const safeIndex = index >= 0 ? index : 0;
  return MAIN_MODES[getLoopedIndex(safeIndex - 1, MAIN_MODES.length)];
}

export function getNextMainMode(mode: GameMode): GameMode {
  const index = MAIN_MODES.indexOf(mode);
  const safeIndex = index >= 0 ? index : 0;
  return MAIN_MODES[getLoopedIndex(safeIndex + 1, MAIN_MODES.length)];
}

export function getPreviousFoodChoice(index: number) {
  return getPreviousItemIndex(index, FOOD_CHOICE_COUNT);
}

export function getNextFoodChoice(index: number) {
  return getNextItemIndex(index, FOOD_CHOICE_COUNT);
}

export function getPreviousItemIndex(index: number, itemCount: number) {
  return getLoopedIndex(index - 1, itemCount);
}

export function getNextItemIndex(index: number, itemCount: number) {
  return getLoopedIndex(index + 1, itemCount);
}

export function showFoodChoiceScreen(now: number): GamePatch {
  return {
    mode: 'food',
    screen: 'hungerChoice',
    selectedIndex: 0,
    choiceReadyAt: now + INPUT_LOCK_MS,
    reaction: null,
  };
}

export function startMainAction(mode: GameMode, now: number): GamePatch {
  if (mode === 'food') {
    return showFoodChoiceScreen(now);
  }

  return {
    screen: 'grid',
    selectedIndex: 0,
    gridReadyAt: now + INPUT_LOCK_MS,
  };
}

export function openFoodGrid(state: GameState, now: number): GamePatch | null {
  if (state.screen !== 'hungerChoice') return null;
  if (now < state.choiceReadyAt) return null;

  return {
    mode: 'food',
    screen: 'grid',
    selectedIndex: 0,
    gridReadyAt: now + INPUT_LOCK_MS,
  };
}

export function startTenMinuteWait(state: GameState, now: number): GamePatch | null {
  if (state.screen !== 'hungerChoice') return null;
  if (now < state.choiceReadyAt) return null;

  return {
    mode: 'food',
    screen: 'resistTimer',
    resistEndsAt: now + RESIST_DURATION_MS,
    selectedIndex: 0,
    reaction: null,
  };
}

export function pickFoodChoice(state: GameState, now: number): GamePatch | null {
  return state.selectedIndex === 0
    ? openFoodGrid(state, now)
    : startTenMinuteWait(state, now);
}

export function canPickFood(state: GameState, now: number) {
  return now >= state.gridReadyAt;
}
