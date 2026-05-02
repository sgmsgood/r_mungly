import './DeviceFrame.css';

interface Props {
  screen: React.ReactNode;
  buttons: React.ReactNode;
}

export function DeviceFrame({ screen, buttons }: Props) {
  return (
    <div className="device">
      <div className="device-screen-wrap">
        <div className="device-screen-inner">
          {screen}
        </div>
      </div>
      <div className="device-buttons-area">
        {buttons}
      </div>
    </div>
  );
}
