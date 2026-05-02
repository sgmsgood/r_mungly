import { useGameStore } from '../stores/gameStore';
import './ItemGrid.css';

export function ItemGrid() {
  const items = useGameStore((s) => s.getItems());
  const selectedIndex = useGameStore((s) => s.selectedIndex);
  const selectItem = useGameStore((s) => s.selectItem);

  return (
    <div className="item-grid">
      {items.map((item, i) => {
        const selected = i === selectedIndex;
        return (
          <button
            key={item.id}
            className={`grid-cell ${selected ? 'selected' : ''}`}
            onClick={() => selectItem(i)}
          >
            <div className="grid-icon">
              {item.assetPath ? (
                <img
                  src={item.assetPath}
                  alt={item.name}
                  className="grid-asset"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const next = e.currentTarget.nextElementSibling as HTMLElement;
                    if (next) next.style.display = 'block';
                  }}
                />
              ) : null}
              <span
                className="grid-emoji"
                style={{ display: item.assetPath ? 'none' : 'block' }}
              >
                {item.emoji}
              </span>
            </div>
            <span className="grid-kcal">{item.kcal}</span>
          </button>
        );
      })}
    </div>
  );
}
