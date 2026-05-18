import { useEffect } from 'react';
import type { GameScreen as GameScreenName } from '../../model/gameTypes';
import { useGameStore } from '../../model/gameStore';
import { PixelRoom } from './PixelRoom';

type CheckInScreen = Extract<
  GameScreenName,
  | 'timerDone'
  | 'urgeCheck'
  | 'urgeStrong'
  | 'urgeLess'
  | 'urgeOkay'
  | 'praiseDone'
  | 'waterDone'
  | 'walkDone'
  | 'resultLog'
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
  praiseDone: {
    thoughtText: '와, 진짜 잘했어!\n한 번 넘긴 너 멋져 ✨',
  },
  waterDone: {
    thoughtText: '좋아, 물 한 잔으로\n한 번 넘겨봤어 💧\n이제 어때?',
  },
  walkDone: {
    thoughtText: '좋은 선택이야.\n걸으면 마음이 환기돼서\n식욕도 잦아들 수 있어.',
  },
  resultLog: {
    thoughtText: '먹는 선택도 괜찮아.\n대신 배부르면 멈추기, 약속!',
  },
};

export function CheckInScene({ screen }: { screen: CheckInScreen }) {
  const scene = CHECK_IN_SCENES[screen];
  const chooseSceneOption = useGameStore((s) => s.chooseSceneOption);

  useEffect(() => {
    if (screen !== 'praiseDone') return;
    const timerId = window.setTimeout(() => chooseSceneOption(0), 10 * 1000);
    return () => window.clearTimeout(timerId);
  }, [chooseSceneOption, screen]);

  return <PixelRoom thoughtText={scene.thoughtText} />;
}
