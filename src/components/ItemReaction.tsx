import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import './ItemReaction.css';

interface Props {
  emoji: string;
  assetPath?: string;
  reactionKey: number;
}

export function ItemReaction({ emoji, assetPath, reactionKey }: Props) {
  const clearReaction = useGameStore((s) => s.clearReaction);

  useEffect(() => {
    const t = setTimeout(clearReaction, 9000);
    return () => clearTimeout(t);
  }, [reactionKey, clearReaction]);

  return (
    <div className="reaction-wrap" key={reactionKey}>
      {assetPath ? (
        <img
          src={assetPath}
          className="reaction-asset"
          style={{ imageRendering: 'pixelated' }}
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = 'none';
            const span = el.nextElementSibling as HTMLElement;
            if (span) span.style.display = 'block';
          }}
          alt=""
        />
      ) : null}
      <span
        className="reaction-emoji"
        style={{ display: assetPath ? 'none' : 'block' }}
      >
        {emoji}
      </span>
    </div>
  );
}
