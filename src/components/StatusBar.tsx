import './StatusBar.css';

export function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-level">LV.1</span>
      <div className="status-hearts">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`status-heart ${i < 3 ? 'filled' : ''}`} />
        ))}
      </div>
    </div>
  );
}
