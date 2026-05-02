import { create } from 'zustand';
import { ITEMS } from '../data/gameItems';
import {
  canPickFood,
  getNextFoodChoice,
  getNextItemIndex,
  getNextMainMode,
  getPreviousFoodChoice,
  getPreviousItemIndex,
  getPreviousMainMode,
  openFoodGrid,
  pickFoodChoice,
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

  getItemsForCurrentMode: () => ITEMS[get().mode],

  onLeft: () => {
    const { screen, mode, selectedIndex } = get();

    if (screen === 'main') {
      set({ mode: getPreviousMainMode(mode), selectedIndex: 0 });
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
    const { screen, mode, selectedIndex } = get();

    if (screen === 'main') {
      set({ mode: getNextMainMode(mode), selectedIndex: 0 });
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
    set({
      screen: 'main',
      reaction: { emoji: item.emoji, assetPath: item.assetPath, key: now },
    });
    if (navigator.vibrate) navigator.vibrate(30);
  },

  onCenterLong: () => {
    const { page, screen } = get();

    if (page === 'settings') {
      set({ page: 'game' });
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
  pickMode: (mode) => set({ mode, selectedIndex: 0 }),
  pickItem: (index) => set({ selectedIndex: index }),
  hideFoodReaction: () => set({ reaction: null }),
}));

export { ITEMS };
