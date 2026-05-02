import { GameScreen } from './features/mungly-game';
import { DeviceButtons, DeviceFrame } from './shared/ui/device';
import './App.css';

function App() {
  return (
    <DeviceFrame
      screen={<GameScreen />}
      buttons={<DeviceButtons />}
    />
  );
}

export default App;
