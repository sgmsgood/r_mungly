import { useEffect, useState } from 'react';
import { useGameStore } from '../../model/gameStore';
import { PixelRoom } from './PixelRoom';
import './ResistTimer.css';

const TIMER_CHOICES = [
  { id: 'check', label: '그만 참을래' },
  { id: 'feed', label: '뭉글리 먹일래' },
];

function formatLeft(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function ResistTimer() {
  const resistEndsAt = useGameStore((s) => s.resistEndsAt);
  const finishResistTimer = useGameStore((s) => s.finishResistTimer);
  const selectedIndex = useGameStore((s) => s.selectedIndex);
  const pickItem = useGameStore((s) => s.pickItem);
  const chooseResistTimerOption = useGameStore((s) => s.chooseResistTimerOption);
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
    <>
      <ResistingRoom
        timerText={done ? '0:00' : formatLeft(remaining)}
        mantraText={done ? '잘 참았어?' : '참을 수 있다,,,'}
      />
      <ResistTimerChoices
        selectedIndex={selectedIndex}
        onPickChoice={(index) => {
          pickItem(index);
          chooseResistTimerOption(index);
        }}
      />
    </>
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

function ResistTimerChoices({
  selectedIndex,
  onPickChoice,
}: {
  selectedIndex: number;
  onPickChoice: (index: number) => void;
}) {
  return (
    <div className="resist-timer-choices">
      {TIMER_CHOICES.map((choice, index) => (
        <button
          key={choice.id}
          className={`resist-timer-choice resist-timer-choice-${choice.id} ${selectedIndex === index ? 'selected' : ''}`}
          type="button"
          onClick={() => onPickChoice(index)}
        >
          <span>{choice.label}</span>
        </button>
      ))}
    </div>
  );
}
