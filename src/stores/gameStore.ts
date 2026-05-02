import { create } from 'zustand';
import type { AppPage, GameScreen, GameMode, GameItem, Reaction } from '../types';

const ITEMS: Record<GameMode, GameItem[]> = {
  food: [
    { id: 'tteok', name: '떡볶이', emoji: '🌶️', kcal: '+280 kcal', assetPath: '/assets/png/foods/tteok.png' },
    { id: 'pizza', name: '피자 1조각', emoji: '🍕', kcal: '+450 kcal', assetPath: '/assets/png/foods/pizza.png' },
    { id: 'donut', name: '도너츠', emoji: '🍩', kcal: '+300 kcal', assetPath: '/assets/png/foods/donut.png' },
    { id: 'egg_tart', name: '에그타르트', emoji: '🥧', kcal: '+225 kcal', assetPath: '/assets/png/foods/egg_tart.png' },
    { id: 'burger', name: '햄버거', emoji: '🍔', kcal: '+520 kcal' },
    { id: 'cake', name: '케이크', emoji: '🍰', kcal: '+360 kcal' },
    { id: 'chicken', name: '치킨', emoji: '🍗', kcal: '+480 kcal' },
    { id: 'ramen', name: '라면', emoji: '🍜', kcal: '+420 kcal' },
    { id: 'ice_cream', name: '아이스크림', emoji: '🍦', kcal: '+280 kcal' },
  ],
  exercise: [
    { id: 'walk', name: '걷기', emoji: '🚶', kcal: '-120 kcal' },
    { id: 'run', name: '러닝', emoji: '🏃', kcal: '-200 kcal' },
    { id: 'weight', name: '웨이트', emoji: '🏋️', kcal: '-180 kcal' },
    { id: 'bike', name: '자전거', emoji: '🚴', kcal: '-160 kcal' },
    { id: 'swim', name: '수영', emoji: '🏊', kcal: '-240 kcal' },
    { id: 'yoga', name: '요가', emoji: '🧘', kcal: '-100 kcal' },
  ],
  shower: [
    { id: 'bath', name: '반신욕', emoji: '🛁', kcal: '-50 kcal' },
    { id: 'cold_shower', name: '냉수샤워', emoji: '🚿', kcal: '-30 kcal' },
    { id: 'stretch', name: '스트레칭', emoji: '🧖', kcal: '-40 kcal' },
    { id: 'massage', name: '마사지', emoji: '💆', kcal: '-20 kcal' },
    { id: 'sauna', name: '사우나', emoji: '♨️', kcal: '-80 kcal' },
    { id: 'foot_bath', name: '족욕', emoji: '🦶', kcal: '-25 kcal' },
  ],
  rest: [
    { id: 'nap', name: '낮잠', emoji: '😴', kcal: '-10 kcal' },
    { id: 'meditation', name: '명상', emoji: '🧘', kcal: '-5 kcal' },
    { id: 'reading', name: '독서', emoji: '📚', kcal: '-8 kcal' },
    { id: 'music', name: '음악감상', emoji: '🎵', kcal: '-5 kcal' },
    { id: 'walk_rest', name: '산책', emoji: '🌿', kcal: '-60 kcal' },
    { id: 'sleep', name: '수면', emoji: '🌙', kcal: '-15 kcal' },
  ],
};

const MODES: GameMode[] = ['food', 'rest'];

interface GameState {
  page: AppPage;
  screen: GameScreen;
  mode: GameMode;
  selectedIndex: number;
  resistEndsAt: number | null;
  choiceReadyAt: number;
  gridReadyAt: number;
  reaction: Reaction | null;
}

interface GameActions {
  onLeft: () => void;
  onRight: () => void;
  onCenter: () => void;
  onCenterLong: () => void;
  openHungerChoice: () => void;
  chooseFeedFirst: () => void;
  startResistTimer: () => void;
  selectMode: (mode: GameMode) => void;
  selectItem: (index: number) => void;
  clearReaction: () => void;
  getItems: () => GameItem[];
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  page: 'game',
  screen: 'main',
  mode: 'food',
  selectedIndex: 0,
  resistEndsAt: null,
  choiceReadyAt: 0,
  gridReadyAt: 0,
  reaction: null,

  getItems: () => ITEMS[get().mode],

  onLeft: () => {
    const { page, screen, mode, selectedIndex } = get();
    if (page === 'settings') {
      set({ page: 'game' });
      return;
    }
    if (screen === 'main') {
      const idx = MODES.indexOf(mode);
      set({ mode: MODES[(idx - 1 + MODES.length) % MODES.length], selectedIndex: 0 });
    } else if (screen === 'hungerChoice') {
      set({ selectedIndex: (selectedIndex - 1 + 2) % 2 });
    } else if (screen === 'resistTimer') {
      set({ screen: 'main', selectedIndex: 0 });
    } else {
      const items = ITEMS[mode];
      set({ selectedIndex: (selectedIndex - 1 + items.length) % items.length });
    }
  },

  onRight: () => {
    const { page, screen, mode, selectedIndex } = get();
    if (page === 'settings') return;
    if (screen === 'main') {
      const idx = MODES.indexOf(mode);
      set({ mode: MODES[(idx + 1) % MODES.length], selectedIndex: 0 });
    } else if (screen === 'hungerChoice') {
      set({ selectedIndex: (selectedIndex + 1) % 2 });
    } else if (screen === 'resistTimer') {
      set({ screen: 'main', selectedIndex: 0 });
    } else {
      const items = ITEMS[mode];
      set({ selectedIndex: (selectedIndex + 1) % items.length });
    }
  },

  onCenter: () => {
    const { page, screen, mode, selectedIndex } = get();
    if (page === 'settings') return;
    if (screen === 'main') {
      if (mode === 'food') {
        set({
          screen: 'hungerChoice',
          selectedIndex: 0,
          choiceReadyAt: Date.now() + 300,
          reaction: null,
        });
      } else {
        set({ screen: 'grid', selectedIndex: 0 });
      }
    } else if (screen === 'hungerChoice') {
      if (Date.now() < get().choiceReadyAt) return;
      if (selectedIndex === 0) {
        set({ screen: 'grid', mode: 'food', selectedIndex: 0, gridReadyAt: Date.now() + 300 });
      } else {
        set({ screen: 'resistTimer', resistEndsAt: Date.now() + 10 * 60 * 1000, selectedIndex: 0 });
      }
    } else if (screen === 'resistTimer') {
      set({ screen: 'main', selectedIndex: 0 });
    } else {
      if (Date.now() < get().gridReadyAt) return;
      const item = ITEMS[mode][selectedIndex];
      set({
        screen: 'main',
        reaction: { emoji: item.emoji, assetPath: item.assetPath, key: Date.now() },
      });
      if (navigator.vibrate) navigator.vibrate(30);
    }
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

  openHungerChoice: () => set({
    mode: 'food',
    screen: 'hungerChoice',
    selectedIndex: 0,
    choiceReadyAt: Date.now() + 300,
    reaction: null,
  }),
  chooseFeedFirst: () => {
    const { screen, choiceReadyAt } = get();
    if (screen !== 'hungerChoice') return;
    if (Date.now() < choiceReadyAt) return;
    set({ mode: 'food', screen: 'grid', selectedIndex: 0, gridReadyAt: Date.now() + 300 });
  },
  startResistTimer: () => {
    const { screen, choiceReadyAt } = get();
    if (screen !== 'hungerChoice') return;
    if (Date.now() < choiceReadyAt) return;
    set({
      mode: 'food',
      screen: 'resistTimer',
      resistEndsAt: Date.now() + 10 * 60 * 1000,
      selectedIndex: 0,
      reaction: null,
    });
  },
  selectMode: (mode) => set({ mode, selectedIndex: 0 }),
  selectItem: (index) => set({ selectedIndex: index }),
  clearReaction: () => set({ reaction: null }),
}));

export { ITEMS };
