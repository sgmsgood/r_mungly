import { useGameStore } from '../stores/gameStore';
import './HungerChoice.css';

const CHOICES = [
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
  const selectItem = useGameStore((s) => s.selectItem);
  const chooseFeedFirst = useGameStore((s) => s.chooseFeedFirst);
  const startResistTimer = useGameStore((s) => s.startResistTimer);

  const runChoice = (index: number) => {
    if (index === 0) {
      chooseFeedFirst();
      return;
    }
    startResistTimer();
  };

  return (
    <div className="hunger-choice">
      <div className="hunger-choice-pet" aria-hidden="true">
        <img
          src="/assets/gif/mozzi_basic.gif"
          className="hunger-choice-img"
          alt=""
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      <div className="hunger-choice-text">
        <span className="hunger-choice-kicker">먹고 싶은 마음이 올라왔어</span>
        <strong>어떻게 넘겨볼까?</strong>
      </div>

      <div className="hunger-choice-list">
        {CHOICES.map((choice, index) => {
          const selected = selectedIndex === index;
          return (
            <button
              key={choice.title}
              className={`hunger-choice-card ${selected ? 'selected' : ''}`}
              onClick={() => {
                selectItem(index);
                runChoice(index);
              }}
            >
              <span className="hunger-choice-title">{choice.title}</span>
              <span className="hunger-choice-caption">{choice.caption}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
