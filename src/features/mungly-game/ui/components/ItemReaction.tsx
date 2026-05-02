import { useEffect, type ReactNode } from 'react';
import { useGameStore } from '../../model/gameStore';
import './ItemReaction.css';

interface Props {
  emoji: string;
  assetPath?: string;
  reactionKey: number;
}

export function ItemReaction({ emoji, assetPath, reactionKey }: Props) {
  const hideFoodReaction = useGameStore((s) => s.hideFoodReaction);

  useEffect(() => {
    const t = setTimeout(hideFoodReaction, 1000);
    return () => clearTimeout(t);
  }, [reactionKey, hideFoodReaction]);

  return (
    <ReactionBubble reactionKey={reactionKey}>
      <ReactionAsset assetPath={assetPath} />
      <ReactionEmoji emoji={emoji} hidden={Boolean(assetPath)} />
    </ReactionBubble>
  );
}

function ReactionBubble({
  reactionKey,
  children,
}: {
  reactionKey: number;
  children: ReactNode;
}) {
  return (
    <div className="reaction-wrap" key={reactionKey}>
      {children}
    </div>
  );
}

function ReactionAsset({ assetPath }: { assetPath?: string }) {
  if (!assetPath) return null;
  return (
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
  );
}

function ReactionEmoji({ emoji, hidden }: { emoji: string; hidden: boolean }) {
  return (
    <span
      className="reaction-emoji"
      style={{ display: hidden ? 'none' : 'block' }}
    >
      {emoji}
    </span>
  );
}
