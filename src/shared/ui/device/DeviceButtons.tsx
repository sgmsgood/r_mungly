import { useRef, type ReactNode } from 'react';
import { useGameStore } from '../../../features/moongly-game/model/gameStore';
import './DeviceButtons.css';

export function DeviceButtons() {
  const {
    onCenter,
    onCenterLong,
    onLeft,
    onRight,
  } = useGameStore();
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
    <DeviceButtonRow>
      <SideButton direction="left" onClick={onLeft} />
      <CenterButton
        onStartLongPress={startLong}
        onEndPress={endCenter}
        onCancelLongPress={cancelLong}
      />
      <SideButton direction="right" onClick={onRight} />
    </DeviceButtonRow>
  );
}

function DeviceButtonRow({ children }: { children: ReactNode }) {
  return <div className="dev-btns">{children}</div>;
}

function SideButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const label = direction === 'left' ? '왼쪽' : '오른쪽';

  return (
    <button className="dev-btn dev-btn-side" onClick={onClick} aria-label={label}>
      <ArrowIcon direction={direction} />
    </button>
  );
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  const path = direction === 'left' ? 'M10 3L5 8L10 13' : 'M6 3L11 8L6 13';

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d={path}
        stroke="#7C6FC7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CenterButton({
  onStartLongPress,
  onEndPress,
  onCancelLongPress,
}: {
  onStartLongPress: () => void;
  onEndPress: () => void;
  onCancelLongPress: () => void;
}) {
  return (
    <button
      className="dev-btn dev-btn-center"
      onPointerDown={onStartLongPress}
      onPointerUp={onEndPress}
      onPointerLeave={onCancelLongPress}
      onPointerCancel={onCancelLongPress}
      aria-label="확인"
    >
      <div className="dev-btn-dot" />
    </button>
  );
}
