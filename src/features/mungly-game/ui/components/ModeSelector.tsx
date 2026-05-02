import { useGameStore } from '../../model/gameStore';
import { MEAL_THOUGHT } from '../../model/gameFlow';
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

interface MealFollowUpChoice {
  id: 'same-food' | 'other-food';
  label: string;
}

const MEAL_FOLLOW_UP_CHOICES: MealFollowUpChoice[] = [
  { id: 'same-food', label: '다시 먹기' },
  { id: 'other-food', label: '다른 음식 먹기' },
];

export function ModeSelector() {
  const mode = useGameStore((s) => s.mode);
  const selectedIndex = useGameStore((s) => s.selectedIndex);
  const munglyThought = useGameStore((s) => s.munglyThought);
  const pickMode = useGameStore((s) => s.pickMode);
  const pickItem = useGameStore((s) => s.pickItem);
  const eatSameFoodAgain = useGameStore((s) => s.eatSameFoodAgain);
  const openFoodGridAfterMeal = useGameStore((s) => s.openFoodGridAfterMeal);
  const showFoodChoiceScreen = useGameStore((s) => s.showFoodChoiceScreen);

  if (munglyThought === MEAL_THOUGHT) {
    return (
      <MealFollowUpList
        selectedIndex={selectedIndex}
        onPickChoice={(index) => {
          pickItem(index);
          if (index === 0) {
            eatSameFoodAgain();
            return;
          }
          openFoodGridAfterMeal();
        }}
      />
    );
  }

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

function MealFollowUpList({
  selectedIndex,
  onPickChoice,
}: {
  selectedIndex: number;
  onPickChoice: (index: number) => void;
}) {
  return (
    <div className="mode-selector">
      {MEAL_FOLLOW_UP_CHOICES.map((choice, index) => (
        <MealFollowUpButton
          key={choice.id}
          choice={choice}
          selected={selectedIndex === index}
          onClick={() => onPickChoice(index)}
        />
      ))}
    </div>
  );
}

function MealFollowUpButton({
  choice,
  selected,
  onClick,
}: {
  choice: MealFollowUpChoice;
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
