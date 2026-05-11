import { create } from 'zustand';
import { CHARACTER_CATALOG } from '../data/characters';
import { ITEMS } from '../data/gameItems';
import {
  canPickFood,
  chooseSceneOption,
  clearMealThought,
  closeMealChoices,
  getNextFoodChoice,
  getNextItemIndex,
  getNextMainMode,
  getNextMealFollowUpChoice,
  getNextSceneChoice,
  getPreviousFoodChoice,
  getPreviousItemIndex,
  getPreviousMainMode,
  getPreviousMealFollowUpChoice,
  getPreviousSceneChoice,
  isMealFollowUpShowing,
  isChoiceScene,
  keepMealChoicesVisible,
  openFoodGrid,
  openFoodGridAfterMeal,
  openChatRoom,
  pickFoodChoice,
  finishResistTimer,
  showFoodReaction,
  showFoodChoiceScreen,
  startMainAction,
  startTenMinuteWait,
} from './gameFlow';
import type { GameItem, GameMode, GameState } from './gameTypes';

const CHARACTER_CREATED_AT_KEY = 'moongly.character.createdAt';

function getInitialCharacterCreatedAt() {
  if (typeof window === 'undefined') return new Date().toISOString();

  try {
    const savedCreatedAt = window.localStorage.getItem(CHARACTER_CREATED_AT_KEY);
    if (savedCreatedAt) return savedCreatedAt;

    const createdAt = new Date().toISOString();
    window.localStorage.setItem(CHARACTER_CREATED_AT_KEY, createdAt);
    return createdAt;
  } catch {
    return new Date().toISOString();
  }
}

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

interface ChatActions {
  openChatRoom: () => void;
  closeChatRoom: () => void;
  setChatChoiceCount: (count: number) => void;
}

interface MealFollowUpActions {
  eatSameFoodAgain: () => void;
  openFoodGridAfterMeal: () => void;
  closeMealChoices: () => void;
  clearMealThought: () => void;
}

interface SceneChoiceActions {
  chooseSceneOption: (index: number) => void;
  finishResistTimer: () => void;
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
  ChatActions &
  MealFollowUpActions &
  SceneChoiceActions &
  ItemChoiceActions &
  FoodReactionActions;

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  page: 'game',
  screen: 'main',
  currentCharacter: {
    name: CHARACTER_CATALOG.mozzi.name,
    character: CHARACTER_CATALOG.mozzi.id,
    createdAt: getInitialCharacterCreatedAt(),
  },
  mode: 'food',
  selectedIndex: 0,
  chatChoiceCount: 0,
  chatSelectToken: 0,
  resistEndsAt: null,
  choiceReadyAt: 0,
  gridReadyAt: 0,
  reaction: null,
  moonglyState: 'waiting',
  moonglyThought: null,
  moonglyThoughtEndsAt: null,
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
        moonglyState: 'waiting',
        moonglyThought: null,
        moonglyThoughtEndsAt: null,
      });
      return;
    }

    if (screen === 'chat') {
      if (state.chatChoiceCount <= 0) return;
      set({
        selectedIndex: getPreviousItemIndex(selectedIndex, state.chatChoiceCount),
      });
      return;
    }

    if (isChoiceScene(state)) {
      set({ selectedIndex: getPreviousSceneChoice(state) });
      return;
    }

    if (screen === 'hungerChoice') {
      set({ selectedIndex: getPreviousFoodChoice(selectedIndex) });
      return;
    }

    if (screen === 'resistTimer') {
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
        moonglyState: 'waiting',
        moonglyThought: null,
        moonglyThoughtEndsAt: null,
      });
      return;
    }

    if (screen === 'chat') {
      if (state.chatChoiceCount <= 0) return;
      set({
        selectedIndex: getNextItemIndex(selectedIndex, state.chatChoiceCount),
      });
      return;
    }

    if (isChoiceScene(state)) {
      set({ selectedIndex: getNextSceneChoice(state) });
      return;
    }

    if (screen === 'hungerChoice') {
      set({ selectedIndex: getNextFoodChoice(selectedIndex) });
      return;
    }

    if (screen === 'resistTimer') {
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

    if (state.screen === 'chat') {
      if (state.chatChoiceCount <= 0) return;
      set({ chatSelectToken: state.chatSelectToken + 1 });
      return;
    }

    if (isChoiceScene(state)) {
      get().chooseSceneOption(state.selectedIndex);
      return;
    }

    if (state.screen === 'hungerChoice') {
      const patch = pickFoodChoice(state, now);
      if (patch) set(patch);
      return;
    }

    if (state.screen === 'resistTimer') {
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
  openChatRoom: () => set(openChatRoom()),
  closeChatRoom: () => set({
    screen: 'main',
    selectedIndex: 0,
    chatChoiceCount: 0,
    moonglyState: 'waiting',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
  }),
  setChatChoiceCount: (count) => set({
    chatChoiceCount: count,
    selectedIndex: 0,
  }),
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
  chooseSceneOption: (index) => {
    const patch = chooseSceneOption(get(), index, Date.now());
    if (patch) set(patch);
  },
  finishResistTimer: () => set(finishResistTimer()),
  clearMealThought: () => {
    const patch = clearMealThought(get(), Date.now());
    if (patch) set(patch);
  },
  pickMode: (mode) => set({
    mode,
    selectedIndex: 0,
    moonglyState: 'waiting',
    moonglyThought: null,
    moonglyThoughtEndsAt: null,
  }),
  pickItem: (index) => set({ selectedIndex: index }),
  hideFoodReaction: () => set({ reaction: null }),
}));

export { ITEMS };
