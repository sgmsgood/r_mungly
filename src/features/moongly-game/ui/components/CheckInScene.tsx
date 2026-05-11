import type { GameScreen as GameScreenName } from '../../model/gameTypes';
import { PixelRoom } from './PixelRoom';

type CheckInScreen = Extract<
  GameScreenName,
  'timerDone' | 'urgeCheck' | 'urgeStrong' | 'urgeLess' | 'urgeOkay' | 'resultLog'
>;

const CHECK_IN_SCENES: Record<CheckInScreen, { thoughtText: string }> = {
  timerDone: {
    thoughtText: '10분 지났어!\n같이 멈춰봤어 💜',
  },
  urgeCheck: {
    thoughtText: '지금 먹고 싶은 마음은\n어때?',
  },
  urgeStrong: {
    thoughtText: '그렇구나!\n한 번만 더 해보자 💜',
  },
  urgeLess: {
    thoughtText: '좋아, 잘 하고 있어!\n조금만 더 밀어보자 ✨',
  },
  urgeOkay: {
    thoughtText: '정말 대단해!\n잘 넘겼어 🥰',
  },
  resultLog: {
    thoughtText: '선택 남겼어!\n다음에도 같이 보자 💜',
  },
};

export function CheckInScene({ screen }: { screen: CheckInScreen }) {
  const scene = CHECK_IN_SCENES[screen];

  return <PixelRoom thoughtText={scene.thoughtText} />;
}
