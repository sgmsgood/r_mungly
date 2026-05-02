import { useGameStore } from '../stores/gameStore';
import { StatusBar } from './StatusBar';
import { PixelRoom } from './PixelRoom';
import { ItemGrid } from './ItemGrid';
import { HungerChoice } from './HungerChoice';
import { ResistTimer } from './ResistTimer';
import { ModeSelector } from './ModeSelector';
import { SettingsScreen } from './SettingsScreen';
import './GameScreen.css';

export function GameScreen() {
  const page = useGameStore((s) => s.page);
  const screen = useGameStore((s) => s.screen);

  if (page === 'settings') {
    return <SettingsScreen />;
  }

  return (
    <div className="game-screen">
      <StatusBar />
      <div className="game-content">
        {screen === 'main' ? <PixelRoom /> : null}
        {screen === 'hungerChoice' ? <HungerChoice /> : null}
        {screen === 'grid' ? <ItemGrid /> : null}
        {screen === 'resistTimer' ? <ResistTimer /> : null}
      </div>
      {screen === 'main' ? <ModeSelector /> : null}
    </div>
  );
}
