import type { ReactNode } from 'react';
import { SettingsScreen } from '../../settings';
import { useGameStore } from '../model/gameStore';
import type { GameScreen as GameScreenName } from '../model/gameTypes';
import {
  HungerChoice,
  ItemGrid,
  ModeSelector,
  PixelRoom,
  ResistTimer,
  StatusBar,
} from './components';
import './GameScreen.css';

export function GameScreen() {
  const page = useGameStore((s) => s.page);
  const screen = useGameStore((s) => s.screen);

  if (page === 'settings') {
    return <SettingsScreen />;
  }

  return (
    <GameShell>
      <StatusBar />
      <GameContent screen={screen} />
      <GameFooter screen={screen} />
    </GameShell>
  );
}

function GameShell({ children }: { children: ReactNode }) {
  return <div className="game-screen">{children}</div>;
}

function GameContent({ screen }: { screen: GameScreenName }) {
  return (
    <div className="game-content">
      <CurrentScreen screen={screen} />
    </div>
  );
}

function CurrentScreen({ screen }: { screen: GameScreenName }) {
  if (screen === 'main') return <PixelRoom />;
  if (screen === 'hungerChoice') return <HungerChoice />;
  if (screen === 'grid') return <ItemGrid />;
  if (screen === 'resistTimer') return <ResistTimer />;
  return null;
}

function GameFooter({ screen }: { screen: GameScreenName }) {
  if (screen !== 'main') return null;
  return <ModeSelector />;
}
