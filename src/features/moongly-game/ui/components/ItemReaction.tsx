import { useEffect, type ReactNode } from 'react';
import { useGameStore } from '../../model/gameStore';
import './ItemReaction.css';

interface Props {
  assetPath?: string;
  reactionKey: number;
}

const REACTION_LIFETIME_MS = 1000;

export function ItemReaction({ assetPath, reactionKey }: Props) {
  const hideFoodReaction = useGameStore((s) => s.hideFoodReaction);

  useEffect(() => {
    const t = setTimeout(hideFoodReaction, REACTION_LIFETIME_MS);
    return () => clearTimeout(t);
  }, [reactionKey, hideFoodReaction]);

  return (
    <ReactionBubble reactionKey={reactionKey}>
      <ReactionAsset assetPath={assetPath} />
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
