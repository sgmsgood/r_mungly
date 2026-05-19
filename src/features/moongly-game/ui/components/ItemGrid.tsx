import { useMemo, useState } from 'react';
import { useGameStore } from '../../model/gameStore';
import type { FoodCategoryId, GameItem } from '../../model/gameTypes';
import './ItemGrid.css';

type FoodCategoryFilter = 'all' | 'favorite' | FoodCategoryId;

interface FoodCategoryTab {
  id: FoodCategoryFilter;
  label: string;
}

const FOOD_CATEGORY_TABS: FoodCategoryTab[] = [
  { id: 'all', label: '전체' },
  { id: 'favorite', label: '즐겨찾기' },
  { id: 'bunsik', label: '분식' },
  { id: 'chicken', label: '치킨' },
  { id: 'chinese', label: '중식' },
  { id: 'pizzaBurger', label: '피자·버거' },
  { id: 'dessert', label: '디저트' },
  { id: 'japanese', label: '일식·회' },
  { id: 'western', label: '양식' },
  { id: 'meat', label: '고기' },
];

export function ItemGrid() {
  const items = useGameStore((s) => s.getItemsForCurrentMode());
  const favoriteItemIds = useGameStore((s) => s.favoriteItemIds);
  const selectedIndex = useGameStore((s) => s.selectedIndex);
  const pickItem = useGameStore((s) => s.pickItem);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategoryFilter>('all');
  const visibleItems = useMemo(
    () => getVisibleItems(items, selectedCategory, favoriteItemIds),
    [favoriteItemIds, items, selectedCategory],
  );

  return (
    <FoodGrid
      items={visibleItems}
      categoryTabs={FOOD_CATEGORY_TABS}
      selectedCategory={selectedCategory}
      selectedIndex={selectedIndex}
      favoriteItemIds={favoriteItemIds}
      onPickCategory={setSelectedCategory}
      onPickFood={pickItem}
    />
  );
}

function getVisibleItems(
  items: GameItem[],
  category: FoodCategoryFilter,
  favoriteItemIds: string[],
) {
  return items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => {
      if (category === 'all') return true;
      if (category === 'favorite') return favoriteItemIds.includes(item.id);
      return item.category === category;
    });
}

function FoodGrid({
  items,
  categoryTabs,
  selectedCategory,
  selectedIndex,
  favoriteItemIds,
  onPickCategory,
  onPickFood,
}: {
  items: Array<{ item: GameItem; originalIndex: number }>;
  categoryTabs: FoodCategoryTab[];
  selectedCategory: FoodCategoryFilter;
  selectedIndex: number;
  favoriteItemIds: string[];
  onPickCategory: (category: FoodCategoryFilter) => void;
  onPickFood: (index: number) => void;
}) {
  return (
    <div className="food-select">
      <FoodCategoryTabs
        tabs={categoryTabs}
        selectedCategory={selectedCategory}
        onPickCategory={onPickCategory}
      />
      <div className="item-grid">
        {items.length > 0 ? (
          items.map(({ item, originalIndex }) => (
            <FoodGridCell
              key={item.id}
              item={item}
              favorite={favoriteItemIds.includes(item.id)}
              selected={originalIndex === selectedIndex}
              onClick={() => onPickFood(originalIndex)}
            />
          ))
        ) : (
          <div className="item-grid-empty">
            <strong>아직 비어 있어</strong>
            <span>곧 좋아하는 음식을 모아둘 수 있어</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FoodCategoryTabs({
  tabs,
  selectedCategory,
  onPickCategory,
}: {
  tabs: FoodCategoryTab[];
  selectedCategory: FoodCategoryFilter;
  onPickCategory: (category: FoodCategoryFilter) => void;
}) {
  return (
    <div className="food-category-tabs" aria-label="음식 카테고리">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`food-category-tab food-category-tab-${tab.id} ${selectedCategory === tab.id ? 'selected' : ''}`}
          type="button"
          onClick={() => onPickCategory(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function FoodGridCell({
  item,
  favorite,
  selected,
  onClick,
}: {
  item: GameItem;
  favorite: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`grid-cell ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className={`grid-favorite ${favorite ? 'active' : ''}`} aria-hidden="true">
        {favorite ? '♥' : '♡'}
      </span>
      <FoodIcon item={item} />
      <span className="grid-name">{item.name}</span>
      <span className="grid-kcal">{item.kcal}</span>
      {item.amount ? <span className="grid-amount">{item.amount}</span> : null}
    </button>
  );
}

function FoodIcon({ item }: { item: GameItem }) {
  return (
    <div className="grid-icon">
      {item.assetPath ? <FoodAsset item={item} /> : null}
      {item.assetPath ? null : <span className="grid-asset-placeholder" />}
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
      }}
    />
  );
}
