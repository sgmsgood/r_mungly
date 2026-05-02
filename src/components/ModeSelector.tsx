import { useGameStore } from '../stores/gameStore';
import type { GameMode } from '../types';
import './ModeSelector.css';

const MODES: { id: GameMode; emoji: string; label: string }[] = [
  { id: 'food', emoji: '🍔', label: '배고파' },
  { id: 'exercise', emoji: '🔥', label: '태우기' },
  { id: 'shower', emoji: '🛁', label: '씻기' },
  { id: 'rest', emoji: '💤', label: '피곤해' },
];

const VISIBLE_MODES = MODES.filter((mode) => mode.id === 'food' || mode.id === 'rest');

export function ModeSelector() {
  const mode = useGameStore((s) => s.mode);
  const selectMode = useGameStore((s) => s.selectMode);
  const openHungerChoice = useGameStore((s) => s.openHungerChoice);

  return (
    <div className="mode-selector">
      {VISIBLE_MODES.map((m) => {
        const selected = mode === m.id;
        return (
          <button
            key={m.id}
            className={`mode-btn mode-btn-${m.id} ${selected ? 'selected' : ''}`}
            onClick={() => {
              if (m.id === 'food') {
                openHungerChoice();
                return;
              }
              selectMode(m.id);
            }}
          >
            <span className="mode-label">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
