import { useGameStore } from '../../model/gameStore';
import type { GameScreen as GameScreenName } from '../../model/gameTypes';
import './SceneChoices.css';

type ChoiceScreen = Extract<
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

interface SceneChoice {
  id: string;
  label: string;
}

const SCENE_CHOICES: Record<ChoiceScreen, SceneChoice[]> = {
  timerDone: [
    { id: 'confirm', label: '확인' },
  ],
  urgeCheck: [
    { id: 'strong', label: '아직 강해' },
    { id: 'less', label: '조금 줄었어' },
    { id: 'okay', label: '괜찮아졌어' },
  ],
  urgeStrong: [
    { id: 'delay', label: '5분만 더' },
    { id: 'substitute', label: '뭉글리 먹이기' },
    { id: 'accept', label: '먹기로 하기' },
  ],
  urgeLess: [
    { id: 'delay', label: '5분만 더' },
    { id: 'water', label: '물 한 잔' },
    { id: 'walk', label: '산책하기' },
  ],
  urgeOkay: [
    // { id: 'record', label: '기록 남기기' },
    { id: 'praise', label: '칭찬 받기' },
    { id: 'home', label: '홈으로' },
  ],
  praiseDone: [
    { id: 'confirm', label: '확인' },
  ],
  waterDone: [
    { id: 'delay', label: '5분만 더' },
    { id: 'substitute', label: '뭉글리 먹이기' },
    { id: 'home', label: '홈으로' },
  ],
  walkDone: [
    { id: 'substitute', label: '뭉글리 먹이기' },
    { id: 'home', label: '홈으로' },
  ],
  resultLog: [
    { id: 'confirm', label: '확인' },
  ],
};

export function SceneChoices({ screen }: { screen: ChoiceScreen }) {
  const selectedIndex = useGameStore((s) => s.selectedIndex);
  const pickItem = useGameStore((s) => s.pickItem);
  const chooseSceneOption = useGameStore((s) => s.chooseSceneOption);
  const choices = SCENE_CHOICES[screen];

  return (
    <div className={`scene-choices scene-choices-${choices.length}`}>
      {choices.map((choice, index) => (
        <SceneChoiceButton
          key={choice.id}
          choice={choice}
          selected={selectedIndex === index}
          onClick={() => {
            pickItem(index);
            chooseSceneOption(index);
          }}
        />
      ))}
    </div>
  );
}

function SceneChoiceButton({
  choice,
  selected,
  onClick,
}: {
  choice: SceneChoice;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`scene-choice-btn scene-choice-btn-${choice.id} ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="scene-choice-label">{choice.label}</span>
    </button>
  );
}
