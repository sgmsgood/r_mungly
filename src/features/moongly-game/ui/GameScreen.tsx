import type { ReactNode } from 'react';
import { SettingsScreen } from '../../settings';
import { useGameStore } from '../model/gameStore';
import type { GameScreen as GameScreenName } from '../model/gameTypes';
import {
  ChatRoom,
  CheckInScene,
  HelpGuideScreen,
  HungerChoice,
  ItemGrid,
  ModeSelector,
  PixelRoom,
  ResistTimer,
  SceneChoices,
  StatusBar,
} from './components';
import './GameScreen.css';

export function GameScreen() {
  const page = useGameStore((s) => s.page);
  const screen = useGameStore((s) => s.screen);

  if (page === 'settings') {
    return <SettingsScreen />;
  }

  if (page === 'help') {
    return <HelpGuideScreen />;
  }

  return (
    <GameShell>
      {screen === 'chat' ? null : <StatusBar showHelpButton={screen === 'main'} />}
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
  if (screen === 'chat') return <ChatRoom />;
  if (isCheckInScreen(screen)) return <CheckInScene screen={screen} />;
  return null;
}

function GameFooter({ screen }: { screen: GameScreenName }) {
  if (isCheckInScreen(screen)) return <SceneChoices screen={screen} />;
  if (screen !== 'main') return null;
  return <ModeSelector />;
}

function isCheckInScreen(screen: GameScreenName): screen is Extract<
  GameScreenName,
  'timerDone' | 'urgeCheck' | 'urgeStrong' | 'urgeLess' | 'urgeOkay' | 'resultLog'
> {
  return (
    screen === 'timerDone' ||
    screen === 'urgeCheck' ||
    screen === 'urgeStrong' ||
    screen === 'urgeLess' ||
    screen === 'urgeOkay' ||
    screen === 'resultLog'
  );
}
