import { useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import './DeviceButtons.css';

export function DeviceButtons() {
  const { onLeft, onRight, onCenter, onCenterLong } = useGameStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longFiredRef = useRef(false);

  const startLong = () => {
    longFiredRef.current = false;
    timerRef.current = setTimeout(() => {
      longFiredRef.current = true;
      onCenterLong();
    }, 500);
  };

  const endCenter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!longFiredRef.current) {
      onCenter();
    }
  };

  const cancelLong = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="dev-btns">
      <button className="dev-btn dev-btn-side" onClick={onLeft} aria-label="왼쪽">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="#7C6FC7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        className="dev-btn dev-btn-center"
        onPointerDown={startLong}
        onPointerUp={endCenter}
        onPointerLeave={cancelLong}
        onPointerCancel={cancelLong}
        aria-label="확인"
      >
        <div className="dev-btn-dot" />
      </button>

      <button className="dev-btn dev-btn-side" onClick={onRight} aria-label="오른쪽">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="#7C6FC7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
