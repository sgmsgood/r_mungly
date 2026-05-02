import { create } from 'zustand';
import { ITEMS } from '../data/gameItems';
import {
  canPickFood,
  clearMealThought,
  closeMealChoices,
  getNextFoodChoice,
  getNextItemIndex,
  getNextMainMode,
  getNextMealFollowUpChoice,
  getPreviousFoodChoice,
  getPreviousItemIndex,
  getPreviousMainMode,
  getPreviousMealFollowUpChoice,
  isMealFollowUpShowing,
  keepMealChoicesVisible,
  openFoodGrid,
  openFoodGridAfterMeal,
  pickFoodChoice,
  showFoodReaction,
  showFoodChoiceScreen,
  startMainAction,
  startTenMinuteWait,
} from './gameFlow';
import type { GameItem, GameMode, GameState } from './gameTypes';

interface DeviceButtonActions {
  onLeft: () => void;
  onRight: () => void;
  onCenter: () => void;
  onCenterLong: () => void;
}

interface MainChoiceActions {
  pickMode: (mode: GameMode) => void;
}

interface FoodChoiceActions {
  showFoodChoiceScreen: () => void;
  openFoodGrid: () => void;
  startTenMinuteWait: () => void;
}

interface MealFollowUpActions {
  eatSameFoodAgain: () => void;
  openFoodGridAfterMeal: () => void;
  closeMealChoices: () => void;
  clearMealThought: () => void;
}

interface ItemChoiceActions {
  pickItem: (index: number) => void;
  getItemsForCurrentMode: () => GameItem[];
}

interface FoodReactionActions {
  hideFoodReaction: () => void;
}

type GameActions =
  DeviceButtonActions &
  MainChoiceActions &
  FoodChoiceActions &
  MealFollowUpActions &
  ItemChoiceActions &
  FoodReactionActions;

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  page: 'game',
  screen: 'main',
  mode: 'food',
  selectedIndex: 0,
  resistEndsAt: null,
  choiceReadyAt: 0,
  gridReadyAt: 0,
  reaction: null,
  munglyThought: null,
  munglyThoughtEndsAt: null,
  lastFoodIndex: null,

  getItemsForCurrentMode: () => ITEMS[get().mode],

  onLeft: () => {
    const state = get();
    const { screen, mode, selectedIndex } = state;

    if (screen === 'main') {
      if (isMealFollowUpShowing(state)) {
        set({
          selectedIndex: getPreviousMealFollowUpChoice(selectedIndex),
          ...keepMealChoicesVisible(Date.now()),
        });
        return;
      }

      set({
        mode: getPreviousMainMode(mode),
        selectedIndex: 0,
        munglyThought: null,
        munglyThoughtEndsAt: null,
      });
      return;
    }

    if (screen === 'hungerChoice') {
      set({ selectedIndex: getPreviousFoodChoice(selectedIndex) });
      return;
    }

    if (screen === 'resistTimer') {
      set({ screen: 'main', selectedIndex: 0 });
      return;
    }

    const items = ITEMS[mode];
    set({ selectedIndex: getPreviousItemIndex(selectedIndex, items.length) });
  },

  onRight: () => {
    const state = get();
    const { screen, mode, selectedIndex } = state;

    if (screen === 'main') {
      if (isMealFollowUpShowing(state)) {
        set({
          selectedIndex: getNextMealFollowUpChoice(selectedIndex),
          ...keepMealChoicesVisible(Date.now()),
        });
        return;
      }

      set({
        mode: getNextMainMode(mode),
        selectedIndex: 0,
        munglyThought: null,
        munglyThoughtEndsAt: null,
      });
      return;
    }

    if (screen === 'hungerChoice') {
      set({ selectedIndex: getNextFoodChoice(selectedIndex) });
      return;
    }

    if (screen === 'resistTimer') {
      set({ screen: 'main', selectedIndex: 0 });
      return;
    }

    const items = ITEMS[mode];
    set({ selectedIndex: getNextItemIndex(selectedIndex, items.length) });
  },

  onCenter: () => {
    const state = get();
    const now = Date.now();

    if (state.page === 'settings') return;

    if (state.screen === 'main') {
      if (isMealFollowUpShowing(state)) {
        if (state.selectedIndex === 0) {
          get().eatSameFoodAgain();
          return;
        }
        get().openFoodGridAfterMeal();
        return;
      }

      set(startMainAction(state.mode, now));
      return;
    }

    if (state.screen === 'hungerChoice') {
      const patch = pickFoodChoice(state, now);
      if (patch) set(patch);
      return;
    }

    if (state.screen === 'resistTimer') {
      set({ screen: 'main', selectedIndex: 0 });
      return;
    }

    if (!canPickFood(state, now)) return;

    const item = ITEMS[state.mode][state.selectedIndex];
    set(showFoodReaction(item, state.selectedIndex, now));
    if (navigator.vibrate) navigator.vibrate(30);
  },

  onCenterLong: () => {
    const state = get();
    const { page, screen } = state;

    if (page === 'settings') {
      set({ page: 'game' });
      return;
    }

    if (isMealFollowUpShowing(state)) {
      set(closeMealChoices());
      return;
    }

    if (screen === 'main') {
      set({ page: 'settings' });
    } else {
      set({ screen: 'main' });
    }
    if (navigator.vibrate) navigator.vibrate(50);
  },

  showFoodChoiceScreen: () => set(showFoodChoiceScreen(Date.now())),
  openFoodGrid: () => {
    const patch = openFoodGrid(get(), Date.now());
    if (patch) set(patch);
  },
  startTenMinuteWait: () => {
    const patch = startTenMinuteWait(get(), Date.now());
    if (patch) set(patch);
  },
  eatSameFoodAgain: () => {
    const state = get();
    const foodIndex = state.lastFoodIndex ?? 0;
    const item = ITEMS.food[foodIndex];
    if (!item) return;
    const now = Date.now();
    set(showFoodReaction(item, foodIndex, now));
    if (navigator.vibrate) navigator.vibrate(30);
  },
  openFoodGridAfterMeal: () => set(openFoodGridAfterMeal(Date.now())),
  closeMealChoices: () => set(closeMealChoices()),
  clearMealThought: () => {
    const patch = clearMealThought(get(), Date.now());
    if (patch) set(patch);
  },
  pickMode: (mode) => set({
    mode,
    selectedIndex: 0,
    munglyThought: null,
    munglyThoughtEndsAt: null,
  }),
  pickItem: (index) => set({ selectedIndex: index }),
  hideFoodReaction: () => set({ reaction: null }),
}));

export { ITEMS };
