import { useGameStore } from '../../model/gameStore';
import type { GameMode } from '../../model/gameTypes';
import './ModeSelector.css';

interface ModeChoice {
  id: GameMode;
  emoji: string;
  label: string;
}

const MODES: ModeChoice[] = [
  { id: 'food', emoji: '🍔', label: '배고파' },
  { id: 'exercise', emoji: '🔥', label: '태우기' },
  { id: 'shower', emoji: '🛁', label: '씻기' },
  { id: 'rest', emoji: '💤', label: '피곤해' },
];

const VISIBLE_MODES = MODES.filter((mode) => mode.id === 'food' || mode.id === 'rest');

export function ModeSelector() {
  const mode = useGameStore((s) => s.mode);
  const pickMode = useGameStore((s) => s.pickMode);
  const showFoodChoiceScreen = useGameStore((s) => s.showFoodChoiceScreen);

  return (
    <ModeChoiceList
      selectedMode={mode}
      onPickMode={(nextMode) => {
        if (nextMode === 'food') {
          showFoodChoiceScreen();
          return;
        }
        pickMode(nextMode);
      }}
    />
  );
}

function ModeChoiceList({
  selectedMode,
  onPickMode,
}: {
  selectedMode: GameMode;
  onPickMode: (mode: GameMode) => void;
}) {
  return (
    <div className="mode-selector">
      {VISIBLE_MODES.map((choice) => (
        <ModeChoiceButton
          key={choice.id}
          choice={choice}
          selected={selectedMode === choice.id}
          onClick={() => onPickMode(choice.id)}
        />
      ))}
    </div>
  );
}

function ModeChoiceButton({
  choice,
  selected,
  onClick,
}: {
  choice: ModeChoice;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`mode-btn mode-btn-${choice.id} ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="mode-label">{choice.label}</span>
    </button>
  );
}
