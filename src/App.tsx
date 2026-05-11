import { GameScreen } from './features/moongly-game';
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
