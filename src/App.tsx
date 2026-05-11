import { useEffect } from 'react';
import { GameScreen } from './features/moongly-game';
import { useGameStore } from './features/moongly-game/model/gameStore';
import { DeviceButtons, DeviceFrame } from './shared/ui/device';
import './App.css';

function App() {
  const screen = useGameStore((s) => s.screen);

  useChatViewport(screen === 'chat');

  if (screen === 'chat') {
    return (
      <div className="app-chat-shell">
        <GameScreen />
      </div>
    );
  }

  return (
    <DeviceFrame
      screen={<GameScreen />}
      buttons={<DeviceButtons />}
    />
  );
}

function useChatViewport(isChatMode: boolean) {
  useEffect(() => {
    if (!isChatMode) return undefined;

    const root = document.documentElement;

    const syncViewport = () => {
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const offsetTop = viewport?.offsetTop ?? 0;

      root.style.setProperty('--chat-visual-height', `${height}px`);
      root.style.setProperty('--chat-visual-top', `${offsetTop}px`);
      window.scrollTo(0, 0);
    };

    document.body.classList.add('chat-mode');
    syncViewport();
    window.setTimeout(syncViewport, 80);
    window.setTimeout(syncViewport, 260);

    window.visualViewport?.addEventListener('resize', syncViewport);
    window.visualViewport?.addEventListener('scroll', syncViewport);
    window.addEventListener('resize', syncViewport);
    window.addEventListener('orientationchange', syncViewport);

    return () => {
      document.body.classList.remove('chat-mode');
      root.style.removeProperty('--chat-visual-height');
      root.style.removeProperty('--chat-visual-top');
      window.visualViewport?.removeEventListener('resize', syncViewport);
      window.visualViewport?.removeEventListener('scroll', syncViewport);
      window.removeEventListener('resize', syncViewport);
      window.removeEventListener('orientationchange', syncViewport);
    };
  }, [isChatMode]);
}

export default App;
