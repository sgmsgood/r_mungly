import type { CharacterDefinition, CharacterId } from '../model/gameTypes';

export const CHARACTER_CATALOG: Record<CharacterId, CharacterDefinition> = {
  mozzi: {
    id: 'mozzi',
    name: '모찌',
    images: {
      basic: '/assets/characters/mozzi/basic.gif',
      enduring: '/assets/characters/mozzi/enduring.gif',
      happy: '/assets/characters/mozzi/happy.gif',
      love: '/assets/characters/mozzi/love_first.gif',
    },
  },
} as const;
