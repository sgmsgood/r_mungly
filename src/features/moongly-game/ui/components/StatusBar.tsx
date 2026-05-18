import type { ReactNode } from 'react';
import { useGameStore } from '../../model/gameStore';
import './StatusBar.css';

const HEARTS = [0, 1, 2, 3, 4];
const FILLED_HEART_COUNT = 3;

export function StatusBar({ showHelpButton = false }: { showHelpButton?: boolean }) {
  const openHelpGuide = useGameStore((s) => s.openHelpGuide);

  return (
    <StatusBarFrame>
      {/* <StatusLevel /> */}
      <div className="status-actions">
        {/* <StatusHearts /> */}
        {showHelpButton ? (
          <button
            className="status-help-button"
            type="button"
            aria-label="조작 설명서 열기"
            onClick={openHelpGuide}
          >
            ?
          </button>
        ) : null}
      </div>
    </StatusBarFrame>
  );
}

function StatusBarFrame({ children }: { children: ReactNode }) {
  return <div className="status-bar">{children}</div>;
}

function StatusLevel() {
  return <span className="status-level">LV.1</span>;
}

function StatusHearts() {
  return (
    <div className="status-hearts">
      {HEARTS.map((heartIndex) => (
        <StatusHeart
          key={heartIndex}
          filled={heartIndex < FILLED_HEART_COUNT}
        />
      ))}
    </div>
  );
}

function StatusHeart({ filled }: { filled: boolean }) {
  return <div className={`status-heart ${filled ? 'filled' : ''}`} />;
}
