'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CATEGORIES = [
  { label: '전체', href: '/shop' },
  { label: '강아지', href: '/shop/dog' },
  { label: '고양이', href: '/shop/cat' },
  { label: '용품', href: '/shop/supplies' },
  { label: '건강', href: '/shop/supplements' },
];

export default function CategoryPills() {
  const pathname = usePathname();

  return (
    <section className="md:hidden w-full py-6 pl-margin-mobile overflow-hidden">
      <div className="flex space-x-3 overflow-x-auto no-scrollbar pr-margin-mobile pb-2">
        {CATEGORIES.map((cat) => {
          const isActive = pathname === cat.href;
          return (
            <Link
              key={cat.label}
              href={cat.href}
              className={
                isActive
                  ? 'flex-shrink-0 bg-primary text-on-primary text-label-md px-4 py-2 rounded-full shadow-sm'
                  : 'flex-shrink-0 bg-surface-container-low border border-outline-variant text-on-surface text-label-md px-4 py-2 rounded-full'
              }
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
