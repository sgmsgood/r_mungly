import type { ReactNode } from 'react';
import './SettingsScreen.css';

interface SettingsItem {
  icon: string;
  label: string;
}

const SETTINGS: SettingsItem[] = [
  { icon: '🎯', label: '목표 설정' },
  { icon: '🔔', label: '알림 설정' },
  { icon: '🎨', label: '테마 변경' },
  { icon: '❓', label: '도움말' },
  { icon: 'ℹ️', label: '버전 정보' },
];

export function SettingsScreen() {
  return (
    <SettingsLayout>
      <SettingsHeader />
      <SettingsList />
    </SettingsLayout>
  );
}

function SettingsLayout({ children }: { children: ReactNode }) {
  return <div className="settings-screen">{children}</div>;
}

function SettingsHeader() {
  return <h2 className="settings-title">설정</h2>;
}

function SettingsList() {
  return (
    <div className="settings-list">
      {SETTINGS.map((item) => (
        <SettingsButton key={item.label} item={item} />
      ))}
    </div>
  );
}

function SettingsButton({ item }: { item: SettingsItem }) {
  return (
    <button className="settings-item">
      <SettingsIcon icon={item.icon} />
      <span className="settings-label">{item.label}</span>
      <SettingsArrow />
    </button>
  );
}

function SettingsIcon({ icon }: { icon: string }) {
  return (
    <div className="settings-icon-box">
      <span>{icon}</span>
    </div>
  );
}

function SettingsArrow() {
  return (
    <div className="settings-arrow">
      <div className="arrow-dot" />
      <div className="arrow-dot" />
      <div className="arrow-dot" />
    </div>
  );
}
