import { useEffect, useState, type ReactNode } from 'react';
import { CHARACTER_CATALOG } from '../../data/characters';
import { useGameStore } from '../../model/gameStore';
import type { CharacterId, MoonglyState, Reaction, UserCharacter } from '../../model/gameTypes';
import { ItemReaction } from './ItemReaction';
import './PixelRoom.css';

const IDLE_THOUGHTS = ['우리 뭐할까?', '터치해줘'];
const IDLE_THOUGHT_INTERVAL_MS = 5000;

interface Props {
  thoughtText?: string | null;
  timerText?: string | null;
  mantraText?: string | null;
}

export function PixelRoom({
  thoughtText,
  timerText = null,
  mantraText = null,
}: Props) {
  const [calendarMessage, setCalendarMessage] = useState<string | null>(null);
  const reaction = useGameStore((s) => s.reaction);
  const currentCharacter = useGameStore((s) => s.currentCharacter);
  const moonglyState = useGameStore((s) => s.moonglyState);
  const moonglyLoveEndsAt = useGameStore((s) => s.moonglyLoveEndsAt);
  const moonglyThought = useGameStore((s) => s.moonglyThought);
  const moonglyThoughtEndsAt = useGameStore((s) => s.moonglyThoughtEndsAt);
  const clearMealThought = useGameStore((s) => s.clearMealThought);
  const showMoonglyLove = useGameStore((s) => s.showMoonglyLove);
  const finishMoonglyLove = useGameStore((s) => s.finishMoonglyLove);
  const [idleThought, setIdleThought] = useState(() => getRandomIdleThought());
  const visibleRoomThought = calendarMessage ?? (
    thoughtText === undefined
      ? moonglyThought ?? idleThought
      : thoughtText
  );
  const moonglyImage = getCharacterImage(currentCharacter.character, moonglyState);

  useEffect(() => {
    if (!moonglyThoughtEndsAt) return;
    const delay = Math.max(0, moonglyThoughtEndsAt - Date.now());
    const timerId = window.setTimeout(clearMealThought, delay);
    return () => window.clearTimeout(timerId);
  }, [clearMealThought, moonglyThoughtEndsAt]);

  useEffect(() => {
    if (!calendarMessage) return;
    const timerId = window.setTimeout(() => setCalendarMessage(null), 2600);
    return () => window.clearTimeout(timerId);
  }, [calendarMessage]);

  useEffect(() => {
    if (thoughtText !== undefined || moonglyThought) return;
    const timerId = window.setInterval(() => {
      setIdleThought((current) => getRandomIdleThought(current));
    }, IDLE_THOUGHT_INTERVAL_MS);
    return () => window.clearInterval(timerId);
  }, [moonglyThought, thoughtText]);

  useEffect(() => {
    if (!moonglyLoveEndsAt) return;
    const delay = Math.max(0, moonglyLoveEndsAt - Date.now());
    const timerId = window.setTimeout(finishMoonglyLove, delay);
    return () => window.clearTimeout(timerId);
  }, [finishMoonglyLove, moonglyLoveEndsAt]);

  return (
    <Room>
      <RoomWall
        onCalendarClick={() => setCalendarMessage('열심히 준비 중')}
      />
      <RoomFloor />
      <MoonglyStage
        thoughtText={visibleRoomThought}
        timerText={timerText}
        mantraText={mantraText}
        isReactionShowing={Boolean(reaction)}
        imageSrc={moonglyImage}
        character={currentCharacter}
        onCharacterTouch={showMoonglyLove}
      />
      <ReactionLayer reaction={reaction} />
    </Room>
  );
}

function Room({ children }: { children: ReactNode }) {
  return <div className="pixel-room">{children}</div>;
}

function getRandomIdleThought(exclude?: string) {
  const nextThoughts = IDLE_THOUGHTS.filter((thought) => thought !== exclude);
  const candidates = nextThoughts.length > 0 ? nextThoughts : IDLE_THOUGHTS;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getCharacterImage(character: CharacterId, moonglyState: MoonglyState) {
  const images = CHARACTER_CATALOG[character].images;
  if (moonglyState === 'love') return images.love;
  if (moonglyState === 'happy') return images.happy;
  if (moonglyState === 'encouraging') return images.enduring;
  return images.basic;
}

function RoomWall({ onCalendarClick }: { onCalendarClick: () => void }) {
  return (
    <>
      <button
        className="room-calendar"
        type="button"
        aria-label="달력 열기"
        onClick={onCalendarClick}
      >
        <span className="calendar-rings" />
        <span className="calendar-grid">
          {Array.from({ length: 12 }, (_, index) => (
            <span
              key={index}
              className={`calendar-day${index === 10 ? ' marked' : ''}`}
            />
          ))}
        </span>
      </button>

      <div className="room-window">
        <div className="window-glass">
          <div className="window-hl" />
          <div className="window-hl window-hl-r" />
        </div>
        <div className="window-divider-h" />
        <div className="window-divider-v" />
      </div>

      <div className="room-cabinet">
        <div className="cabinet-plant" />
        <div className="cabinet-book cabinet-book-a" />
        <div className="cabinet-book cabinet-book-b" />
        <div className="cabinet-door cabinet-door-left">
          <span />
        </div>
        <div className="cabinet-door cabinet-door-right">
          <span />
        </div>
      </div>

      <div className="wall-dot wd1" />
      <div className="wall-dot wd2" />
      <div className="wall-dot wd3" />
    </>
  );
}

function RoomFloor() {
  return (
    <div className="room-floor">
      <RoomPlant />
      <RoomSofa />
    </div>
  );
}

function RoomPlant() {
  return (
    <div className="floor-plant">
      <div className="plant-leaves">
        <div className="leaf leaf-l" />
        <div className="leaf leaf-r" />
        <div className="leaf leaf-top" />
      </div>
      <div className="plant-stem" />
      <div className="plant-pot" />
    </div>
  );
}

function RoomSofa() {
  return (
    <div className="floor-sofa" aria-hidden="true">
      <div className="sofa-back" />
      <div className="sofa-seat" />
      <div className="sofa-hl" />
    </div>
  );
}

interface MoonglyStageProps extends Props {
  isReactionShowing: boolean;
  imageSrc: string;
  character: UserCharacter;
  onCharacterTouch: () => void;
}

function MoonglyStage({
  thoughtText,
  timerText,
  mantraText,
  isReactionShowing,
  imageSrc,
  character,
  onCharacterTouch,
}: MoonglyStageProps) {
  const visibleThoughtText = timerText || isReactionShowing ? null : thoughtText;

  return (
    <div className="character-wrap">
      <MantraBubble text={mantraText} />
      <TimerBubble text={timerText} />
      <ThoughtBubble text={visibleThoughtText} />
      <MoonglyCharacter
        imageSrc={imageSrc}
        character={character}
        onTouch={onCharacterTouch}
      />
    </div>
  );
}

function MantraBubble({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <div className="mantra-bubble" aria-hidden="true">
      {text}
    </div>
  );
}

function TimerBubble({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <div className="timer-bubble" aria-label="남은 시간">
      {text}
    </div>
  );
}

function ThoughtBubble({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <div className="thought-bubble" aria-hidden="true">
      {text}
      <span className="thought-dot thought-dot-a" />
      <span className="thought-dot thought-dot-b" />
    </div>
  );
}

function MoonglyCharacter({
  imageSrc,
  character,
  onTouch,
}: {
  imageSrc: string;
  character: UserCharacter;
  onTouch: () => void;
}) {
  return (
    <>
      <button
        className="character-button"
        type="button"
        aria-label={`${character.name} 쓰다듬기`}
        onClick={onTouch}
      >
        <img
          src={imageSrc}
          className="character-img"
          alt={character.name}
          style={{ imageRendering: 'pixelated' }}
        />
      </button>
      <span className="character-name">{character.name}</span>
    </>
  );
}

function ReactionLayer({ reaction }: { reaction: Reaction | null }) {
  if (!reaction) return null;
  return (
    <ItemReaction
      key={reaction.key}
      reactionKey={reaction.key}
      assetPath={reaction.assetPath}
    />
  );
}
