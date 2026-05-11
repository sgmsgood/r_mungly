import type { ReactNode } from 'react';
import { CHARACTER_CATALOG } from '../../data/characters';
import { useGameStore } from '../../model/gameStore';
import './HungerChoice.css';

interface HungerChoiceItem {
  title: string;
  caption: string;
}

const CHOICES: HungerChoiceItem[] = [
  {
    title: '뭉글리에게 먼저 먹이기',
    caption: '음식 고르기',
  },
  {
    title: '10분만 참아볼래',
    caption: '타이머 시작',
  },
];

export function HungerChoice() {
  const selectedIndex = useGameStore((s) => s.selectedIndex);
  const pickItem = useGameStore((s) => s.pickItem);
  const openFoodGrid = useGameStore((s) => s.openFoodGrid);
  const startTenMinuteWait = useGameStore((s) => s.startTenMinuteWait);

  const runChoice = (index: number) => {
    if (index === 0) {
      openFoodGrid();
      return;
    }
    startTenMinuteWait();
  };

  return (
    <HungerChoiceScreen>
      <HungerChoicePet />
      <HungerChoiceHeader />
      <HungerChoiceList
        selectedIndex={selectedIndex}
        onPickChoice={(index) => {
          pickItem(index);
          runChoice(index);
        }}
      />
    </HungerChoiceScreen>
  );
}

function HungerChoiceScreen({ children }: { children: ReactNode }) {
  return <div className="hunger-choice">{children}</div>;
}

function HungerChoicePet() {
  const currentCharacter = useGameStore((s) => s.currentCharacter);
  const character = CHARACTER_CATALOG[currentCharacter.character];

  return (
    <div className="hunger-choice-pet">
      <img
        src={character.images.basic}
        className="hunger-choice-img"
        alt={currentCharacter.name}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

function HungerChoiceHeader() {
  return (
    <div className="hunger-choice-text">
      <span className="hunger-choice-kicker">먹고 싶은 마음이 올라왔어</span>
      <strong>어떻게 넘겨볼까?</strong>
    </div>
  );
}

function HungerChoiceList({
  selectedIndex,
  onPickChoice,
}: {
  selectedIndex: number;
  onPickChoice: (index: number) => void;
}) {
  return (
    <div className="hunger-choice-list">
      {CHOICES.map((choice, index) => (
        <HungerChoiceCard
          key={choice.title}
          choice={choice}
          selected={selectedIndex === index}
          onClick={() => onPickChoice(index)}
        />
      ))}
    </div>
  );
}

function HungerChoiceCard({
  choice,
  selected,
  onClick,
}: {
  choice: HungerChoiceItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`hunger-choice-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="hunger-choice-title">{choice.title}</span>
      <span className="hunger-choice-caption">{choice.caption}</span>
    </button>
  );
}
