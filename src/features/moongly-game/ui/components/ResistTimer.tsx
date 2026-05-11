import { useEffect, useState } from 'react';
import { useGameStore } from '../../model/gameStore';
import { PixelRoom } from './PixelRoom';

function formatLeft(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function ResistTimer() {
  const resistEndsAt = useGameStore((s) => s.resistEndsAt);
  const finishResistTimer = useGameStore((s) => s.finishResistTimer);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = resistEndsAt ? resistEndsAt - now : 0;
  const done = remaining <= 0;

  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(finishResistTimer, 250);
    return () => window.clearTimeout(id);
  }, [done, finishResistTimer]);

  return (
    <ResistingRoom
      timerText={done ? '0:00' : formatLeft(remaining)}
      mantraText={done ? '잘 참았어?' : '참을 수 있다,,,'}
    />
  );
}

function ResistingRoom({
  timerText,
  mantraText,
}: {
  timerText: string;
  mantraText: string;
}) {
  return (
    <PixelRoom
      thoughtText={null}
      timerText={timerText}
      mantraText={mantraText}
    />
  );
}
