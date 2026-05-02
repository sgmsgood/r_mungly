import type { ReactNode } from 'react';
import './DeviceFrame.css';

interface Props {
  screen: ReactNode;
  buttons: ReactNode;
}

export function DeviceFrame({ screen, buttons }: Props) {
  return (
    <DeviceShell>
      <DeviceScreen>{screen}</DeviceScreen>
      <DeviceControls>{buttons}</DeviceControls>
    </DeviceShell>
  );
}

function DeviceShell({ children }: { children: ReactNode }) {
  return <div className="device">{children}</div>;
}

function DeviceScreen({ children }: { children: ReactNode }) {
  return (
    <div className="device-screen-wrap">
      <div className="device-screen-inner">{children}</div>
    </div>
  );
}

function DeviceControls({ children }: { children: ReactNode }) {
  return <div className="device-buttons-area">{children}</div>;
}
