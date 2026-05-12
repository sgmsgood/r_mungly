import type { ReactNode } from 'react';
import { useGameStore } from '../../moongly-game/model/gameStore';
import packageJsonText from '../../../../package.json?raw';
import './SettingsScreen.css';

interface SettingsItem {
  icon: string;
  label: string;
  type?: 'button' | 'info';
}

const SETTINGS: SettingsItem[] = [
  // { icon: '🎯', label: '목표 설정' },
  // { icon: '🔔', label: '알림 설정' },
  // { icon: '🎨', label: '테마 변경' },
  // { icon: '❓', label: '도움말' },
  { icon: 'ℹ️', label: '버전 정보', type: 'info' },
];

const APP_VERSION = getPackageVersion(packageJsonText);

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
  const closePage = useGameStore((s) => s.closePage);

  return (
    <header className="settings-header">
      <h2 className="settings-title">설정</h2>
      <button
        className="settings-close-button"
        type="button"
        aria-label="설정 닫기"
        onClick={closePage}
      >
        ×
      </button>
    </header>
  );
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
  if (item.type === 'info') {
    return (
      <div className="settings-item settings-info-item" aria-label={`${item.label} ${APP_VERSION}`}>
        <SettingsIcon icon={item.icon} />
        <span className="settings-label">{item.label}</span>
        <span className="settings-version">v{APP_VERSION}</span>
      </div>
    );
  }

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

function getPackageVersion(packageJson: string) {
  try {
    const parsed = JSON.parse(packageJson) as { version?: unknown };
    return typeof parsed.version === 'string' ? parsed.version : '0.0.0';
  } catch {
    return '0.0.0';
  }
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
