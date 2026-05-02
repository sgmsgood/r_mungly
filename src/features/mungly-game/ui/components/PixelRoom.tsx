import type { ReactNode } from 'react';
import { useGameStore } from '../../model/gameStore';
import type { Reaction } from '../../model/gameTypes';
import { ItemReaction } from './ItemReaction';
import './PixelRoom.css';

interface Props {
  thoughtText?: string | null;
  timerText?: string | null;
  mantraText?: string | null;
}

export function PixelRoom({
  thoughtText = '어떤 상태야?',
  timerText = null,
  mantraText = null,
}: Props) {
  const reaction = useGameStore((s) => s.reaction);

  return (
    <Room>
      <RoomWall />
      <RoomFloor />
      <MunglyStage
        thoughtText={thoughtText}
        timerText={timerText}
        mantraText={mantraText}
      />
      <ReactionLayer reaction={reaction} />
    </Room>
  );
}

function Room({ children }: { children: ReactNode }) {
  return <div className="pixel-room">{children}</div>;
}

function RoomWall() {
  return (
    <>
      <div className="room-window">
        <div className="window-glass">
          <div className="window-hl" />
          <div className="window-hl window-hl-r" />
        </div>
        <div className="window-divider-h" />
        <div className="window-divider-v" />
      </div>

      <div className="room-shelf">
        <div className="shelf-item shelf-item-a" />
        <div className="shelf-item shelf-item-b" />
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
      <RoomCushion />
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

function RoomCushion() {
  return (
    <div className="floor-cushion">
      <div className="cushion-hl" />
    </div>
  );
}

function MunglyStage({ thoughtText, timerText, mantraText }: Props) {
  return (
    <div className="character-wrap">
      <MantraBubble text={mantraText} />
      <TimerBubble text={timerText} />
      <ThoughtBubble text={timerText ? null : thoughtText} />
      <MunglyCharacter />
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

function MunglyCharacter() {
  return (
    <>
      <img
        src="/assets/gif/mozzi_basic.gif"
        className="character-img"
        alt="모찌"
        style={{ imageRendering: 'pixelated' }}
      />
      <span className="character-name">모찌</span>
    </>
  );
}

function ReactionLayer({ reaction }: { reaction: Reaction | null }) {
  if (!reaction) return null;
  return (
    <ItemReaction
      key={reaction.key}
      reactionKey={reaction.key}
      emoji={reaction.emoji}
      assetPath={reaction.assetPath}
    />
  );
}
