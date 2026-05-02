import './SettingsScreen.css';

const SETTINGS = [
  { icon: '🎯', label: '목표 설정' },
  { icon: '🔔', label: '알림 설정' },
  { icon: '🎨', label: '테마 변경' },
  { icon: '❓', label: '도움말' },
  { icon: 'ℹ️', label: '버전 정보' },
];

export function SettingsScreen() {
  return (
    <div className="settings-screen">
      <h2 className="settings-title">설정</h2>
      <div className="settings-list">
        {SETTINGS.map((item) => (
          <button key={item.label} className="settings-item">
            <div className="settings-icon-box">
              <span>{item.icon}</span>
            </div>
            <span className="settings-label">{item.label}</span>
            <div className="settings-arrow">
              <div className="arrow-dot" />
              <div className="arrow-dot" />
              <div className="arrow-dot" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
