import { useGameStore } from '../../model/gameStore';
import './HelpGuideScreen.css';

export function HelpGuideScreen() {
  const closePage = useGameStore((s) => s.closePage);

  return (
    <section className="help-screen" aria-label="조작 설명서">
      <header className="help-screen-header">
        <h2>조작 설명서</h2>
        <button
          className="help-close-button"
          type="button"
          aria-label="조작 설명서 닫기"
          onClick={closePage}
        >
          ×
        </button>
      </header>

      <div className="help-screen-body">
        <img
          className="help-screen-image"
          src="/assets/help/control-guide.png"
          alt="좌우 버튼은 선택항목 이동, 확인 버튼 짧게 누르기는 선택, 길게 누르기는 메인 화면 또는 설정 화면 이동"
        />
      </div>
    </section>
  );
}
