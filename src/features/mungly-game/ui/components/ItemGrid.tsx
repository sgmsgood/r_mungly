import { useGameStore } from '../../model/gameStore';
import type { GameItem } from '../../model/gameTypes';
import './ItemGrid.css';

export function ItemGrid() {
  const items = useGameStore((s) => s.getItemsForCurrentMode());
  const selectedIndex = useGameStore((s) => s.selectedIndex);
  const pickItem = useGameStore((s) => s.pickItem);

  return (
    <FoodGrid
      items={items}
      selectedIndex={selectedIndex}
      onPickFood={pickItem}
    />
  );
}

function FoodGrid({
  items,
  selectedIndex,
  onPickFood,
}: {
  items: GameItem[];
  selectedIndex: number;
  onPickFood: (index: number) => void;
}) {
  return (
    <div className="item-grid">
      {items.map((item, index) => (
        <FoodGridCell
          key={item.id}
          item={item}
          selected={index === selectedIndex}
          onClick={() => onPickFood(index)}
        />
      ))}
    </div>
  );
}

function FoodGridCell({
  item,
  selected,
  onClick,
}: {
  item: GameItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`grid-cell ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <FoodIcon item={item} />
      <span className="grid-kcal">{item.kcal}</span>
    </button>
  );
}

function FoodIcon({ item }: { item: GameItem }) {
  return (
    <div className="grid-icon">
      {item.assetPath ? <FoodAsset item={item} /> : null}
      <span
        className="grid-emoji"
        style={{ display: item.assetPath ? 'none' : 'block' }}
      >
        {item.emoji}
      </span>
    </div>
  );
}

function FoodAsset({ item }: { item: GameItem }) {
  return (
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
  );
}
