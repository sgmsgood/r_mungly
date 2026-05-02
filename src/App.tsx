import { DeviceFrame } from './components/DeviceFrame';
import { DeviceButtons } from './components/DeviceButtons';
import { GameScreen } from './components/GameScreen';
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
