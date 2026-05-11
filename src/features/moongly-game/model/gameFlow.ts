import type { GameItem, GameMode, GameState } from './gameTypes';

const INPUT_LOCK_MS = 300;
const FOOD_REACTION_LIFETIME_MS = 1000;
const MEAL_THOUGHT_DURATION_MS = 5000;
const TEN_MINUTES_MS = 10 * 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;
const RESIST_DURATION_MS = import.meta.env.DEV ? 10 * 1000 : TEN_MINUTES_MS;
const SHORT_RESIST_DURATION_MS = import.meta.env.DEV ? 5 * 1000 : FIVE_MINUTES_MS;
const FOOD_CHOICE_COUNT = 2;
const MEAL_FOLLOW_UP_COUNT = 2;
const TIMER_DONE_CHOICE_COUNT = 1;
const URGE_CHECK_CHOICE_COUNT = 3;
const URGE_DECISION_CHOICE_COUNT = 3;
const RESULT_LOG_CHOICE_COUNT = 1;

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

export function getSceneChoiceCount(state: GameState) {
  if (state.screen === 'timerDone') return TIMER_DONE_CHOICE_COUNT;
  if (state.screen === 'urgeCheck') return URGE_CHECK_CHOICE_COUNT;
  if (
    state.screen === 'urgeStrong' ||
    state.screen === 'urgeLess' ||
    state.screen === 'urgeOkay'
  ) {
    return URGE_DECISION_CHOICE_COUNT;
  }
  if (state.screen === 'resultLog') return RESULT_LOG_CHOICE_COUNT;
  return 0;
}

export function isChoiceScene(state: GameState) {
  return getSceneChoiceCount(state) > 0;
}

export function getPreviousSceneChoice(state: GameState) {
  return getPreviousItemIndex(state.selectedIndex, getSceneChoiceCount(state));
}

export function getNextSceneChoice(state: GameState) {
  return getNextItemIndex(state.selectedIndex, getSceneChoiceCount(state));
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
    moonglyState: 'tempted',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
  };
}

export function startMainAction(mode: GameMode, now: number): GamePatch {
  if (mode === 'food') {
    return showFoodChoiceScreen(now);
  }

  if (mode === 'rest') {
    return openChatRoom();
  }

  return {
    screen: 'grid',
    selectedIndex: 0,
    gridReadyAt: now + INPUT_LOCK_MS,
    moonglyState: 'waiting',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
  };
}

export function openChatRoom(): GamePatch {
  return {
    screen: 'chat',
    mode: 'rest',
    selectedIndex: 0,
    chatChoiceCount: 0,
    reaction: null,
    moonglyState: 'waiting',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
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
    moonglyState: 'waiting',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
  };
}

export function openFoodGridAfterMeal(now: number): GamePatch {
  return {
    mode: 'food',
    screen: 'grid',
    selectedIndex: 0,
    gridReadyAt: now + INPUT_LOCK_MS,
    reaction: null,
    moonglyState: 'waiting',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
  };
}

export function startTenMinuteWait(state: GameState, now: number): GamePatch | null {
  if (state.screen !== 'hungerChoice' && state.screen !== 'chat') return null;
  if (now < state.choiceReadyAt) return null;

  return {
    mode: 'food',
    screen: 'resistTimer',
    resistEndsAt: now + RESIST_DURATION_MS,
    selectedIndex: 0,
    reaction: null,
    moonglyState: 'encouraging',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
  };
}

function startShortWait(now: number): GamePatch {
  return {
    mode: 'food',
    screen: 'resistTimer',
    resistEndsAt: now + SHORT_RESIST_DURATION_MS,
    selectedIndex: 0,
    reaction: null,
    moonglyState: 'encouraging',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
  };
}

export function finishResistTimer(): GamePatch {
  return {
    screen: 'timerDone',
    selectedIndex: 0,
    resistEndsAt: null,
    reaction: null,
    moonglyState: 'waiting',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
  };
}

export function chooseSceneOption(state: GameState, choiceIndex: number, now: number): GamePatch | null {
  if (state.screen === 'timerDone') {
    return {
      screen: 'urgeCheck',
      selectedIndex: 0,
      moonglyState: 'tempted',
    };
  }

  if (state.screen === 'urgeCheck') {
    if (choiceIndex === 0) {
      return {
        screen: 'urgeStrong',
        selectedIndex: 0,
        moonglyState: 'comforting',
      };
    }
    if (choiceIndex === 1) {
      return {
        screen: 'urgeLess',
        selectedIndex: 0,
        moonglyState: 'relieved',
      };
    }
    return {
      screen: 'urgeOkay',
      selectedIndex: 0,
      moonglyState: 'proud',
    };
  }

  if (state.screen === 'urgeStrong') {
    if (choiceIndex === 0) return startShortWait(now);
    if (choiceIndex === 1) return openFoodGridAfterMeal(now);
    return {
      screen: 'resultLog',
      selectedIndex: 0,
      moonglyState: 'comforting',
      moonglyThought: null,
      moonglyThoughtEndsAt: null,
    };
  }

  if (state.screen === 'urgeLess') {
    if (choiceIndex === 0) return startShortWait(now);
    if (choiceIndex === 1) {
      return {
        screen: 'resultLog',
        selectedIndex: 0,
        moonglyState: 'relieved',
        moonglyThought: null,
        moonglyThoughtEndsAt: null,
      };
    }
    return openFoodGridAfterMeal(now);
  }

  if (state.screen === 'urgeOkay') {
    return {
      screen: choiceIndex === 2 ? 'main' : 'resultLog',
      selectedIndex: 0,
      moonglyState: choiceIndex === 1 ? 'happy' : 'satisfied',
      moonglyThought: null,
      moonglyThoughtEndsAt: null,
    };
  }

  if (state.screen === 'resultLog') {
    return {
      screen: 'main',
      selectedIndex: 0,
      moonglyState: 'waiting',
      moonglyThought: null,
      moonglyThoughtEndsAt: null,
    };
  }

  return null;
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
  return state.screen === 'main' && state.moonglyThought === MEAL_THOUGHT;
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
    moonglyState: 'happy',
    moonglyThought: MEAL_THOUGHT,
    moonglyThoughtEndsAt: now + FOOD_REACTION_LIFETIME_MS + MEAL_THOUGHT_DURATION_MS,
  };
}

export function keepMealChoicesVisible(now: number): GamePatch {
  return {
    moonglyThoughtEndsAt: now + MEAL_THOUGHT_DURATION_MS,
  };
}

export function closeMealChoices(): GamePatch {
  return {
    selectedIndex: 0,
    reaction: null,
    moonglyState: 'waiting',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
  };
}

export function clearMealThought(state: GameState, now: number): GamePatch | null {
  if (state.moonglyThought !== MEAL_THOUGHT) return null;
  if (!state.moonglyThoughtEndsAt) return null;
  if (now < state.moonglyThoughtEndsAt) return null;

  return closeMealChoices();
}
