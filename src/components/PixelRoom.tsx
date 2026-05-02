import { useGameStore } from '../stores/gameStore';
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
    <div className="pixel-room">
      {/* Wall decorations */}
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

      {/* Floor */}
      <div className="room-floor">
        <div className="floor-plant">
          <div className="plant-leaves">
            <div className="leaf leaf-l" />
            <div className="leaf leaf-r" />
            <div className="leaf leaf-top" />
          </div>
          <div className="plant-stem" />
          <div className="plant-pot" />
        </div>

        <div className="floor-cushion">
          <div className="cushion-hl" />
        </div>
      </div>

      {/* Character */}
      <div className="character-wrap">
        {mantraText ? (
          <div className="mantra-bubble" aria-hidden="true">
            {mantraText}
          </div>
        ) : null}
        {timerText ? (
          <div className="timer-bubble" aria-label="남은 시간">
            {timerText}
          </div>
        ) : null}
        {thoughtText && !timerText ? (
          <div className="thought-bubble" aria-hidden="true">
            {thoughtText}
            <span className="thought-dot thought-dot-a" />
            <span className="thought-dot thought-dot-b" />
          </div>
        ) : null}
        <img
          src="/assets/gif/mozzi_basic.gif"
          className="character-img"
          alt="모찌"
          style={{ imageRendering: 'pixelated' }}
        />
        <span className="character-name">모찌</span>
      </div>

      {/* Reaction overlay */}
      {reaction && (
        <ItemReaction
          key={reaction.key}
          reactionKey={reaction.key}
          emoji={reaction.emoji}
          assetPath={reaction.assetPath}
        />
      )}
    </div>
  );
}
