import type { GameItem, GameMode, GameState } from './gameTypes';

const INPUT_LOCK_MS = 300;
const FOOD_REACTION_LIFETIME_MS = 1000;
const MEAL_THOUGHT_DURATION_MS = 5000;
const RESIST_DURATION_MS = 10 * 60 * 1000;
const FOOD_CHOICE_COUNT = 2;
const MEAL_FOLLOW_UP_COUNT = 2;

export const MAIN_MODES: GameMode[] = ['food', 'rest'];
export const MEAL_THOUGHT = '맛있다 *^^*';

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

export function getPreviousMealFollowUpChoice(index: number) {
  return getPreviousItemIndex(index, MEAL_FOLLOW_UP_COUNT);
}

export function getNextMealFollowUpChoice(index: number) {
  return getNextItemIndex(index, MEAL_FOLLOW_UP_COUNT);
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
    munglyThought: null,
    munglyThoughtEndsAt: null,
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
    munglyThought: null,
    munglyThoughtEndsAt: null,
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
    munglyThought: null,
    munglyThoughtEndsAt: null,
  };
}

export function openFoodGridAfterMeal(now: number): GamePatch {
  return {
    mode: 'food',
    screen: 'grid',
    selectedIndex: 0,
    gridReadyAt: now + INPUT_LOCK_MS,
    reaction: null,
    munglyThought: null,
    munglyThoughtEndsAt: null,
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
    munglyThought: null,
    munglyThoughtEndsAt: null,
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

export function isMealFollowUpShowing(state: GameState) {
  return state.screen === 'main' && state.munglyThought === MEAL_THOUGHT;
}

export function showFoodReaction(
  item: GameItem,
  foodIndex: number,
  now: number,
): GamePatch {
  return {
    mode: 'food',
    screen: 'main',
    selectedIndex: 0,
    lastFoodIndex: foodIndex,
    reaction: { emoji: item.emoji, assetPath: item.assetPath, key: now },
    munglyThought: MEAL_THOUGHT,
    munglyThoughtEndsAt: now + FOOD_REACTION_LIFETIME_MS + MEAL_THOUGHT_DURATION_MS,
  };
}

export function keepMealChoicesVisible(now: number): GamePatch {
  return {
    munglyThoughtEndsAt: now + MEAL_THOUGHT_DURATION_MS,
  };
}

export function closeMealChoices(): GamePatch {
  return {
    selectedIndex: 0,
    reaction: null,
    munglyThought: null,
    munglyThoughtEndsAt: null,
  };
}

export function clearMealThought(state: GameState, now: number): GamePatch | null {
  if (state.munglyThought !== MEAL_THOUGHT) return null;
  if (!state.munglyThoughtEndsAt) return null;
  if (now < state.munglyThoughtEndsAt) return null;

  return closeMealChoices();
}
