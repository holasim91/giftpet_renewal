interface Category {
  label: string;
  active?: boolean;
}

const CATEGORIES: Category[] = [
  { label: '전체', active: true },
  { label: '강아지' },
  { label: '고양이' },
  { label: '용품' },
  { label: '건강' },
];

export default function CategoryPills() {
  return (
    <section className="md:hidden w-full py-6 pl-margin-mobile overflow-hidden">
      <div className="flex space-x-3 overflow-x-auto no-scrollbar pr-margin-mobile pb-2">
        {CATEGORIES.map((cat) =>
          cat.active ? (
            <button
              key={cat.label}
              type="button"
              className="flex-shrink-0 bg-primary text-on-primary text-label-md px-4 py-2 rounded-full shadow-sm"
            >
              {cat.label}
            </button>
          ) : (
            <button
              key={cat.label}
              type="button"
              className="flex-shrink-0 bg-surface-container-low border border-outline-variant text-on-surface text-label-md px-4 py-2 rounded-full"
            >
              {cat.label}
            </button>
          )
        )}
      </div>
    </section>
  );
}
