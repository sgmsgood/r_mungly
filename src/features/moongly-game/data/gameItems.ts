import type { GameItem, GameMode } from '../model/gameTypes';

export const ITEMS: Record<GameMode, GameItem[]> = {
  food: [
    { id: 'tteok', name: '떡볶이', emoji: '🌶️', kcal: '+280 kcal', assetPath: '/assets/png/foods/tteok.png' },
    { id: 'pizza', name: '피자 1조각', emoji: '🍕', kcal: '+450 kcal', assetPath: '/assets/png/foods/pizza.png' },
    { id: 'donut', name: '도너츠', emoji: '🍩', kcal: '+300 kcal', assetPath: '/assets/png/foods/donut.png' },
    { id: 'pork', name: '삼겹살', emoji: '🍩', kcal: '+300 kcal', assetPath: '/assets/png/foods/pork.png' },
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

