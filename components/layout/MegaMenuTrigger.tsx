'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { NAV_CATEGORIES } from '@/lib/constants';

export default function MegaMenuTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => setIsOpen(false);

  return (
    <div
      className="group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={close}
      onBlur={(e) => {
        // 포커스가 이 div 밖으로 나가면 닫기
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          close();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            close();
            triggerRef.current?.blur();
          }
        }}
        className="text-label-md tracking-wider uppercase text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 ease-out"
      >
        모든 카테고리
      </button>

      <div
        className={[
          'absolute top-[calc(100%+1rem)] left-0 w-full bg-white',
          'shadow-[0px_10px_30px_rgba(0,0,0,0.1)] rounded-b-xl border-t border-surface-container',
          'transition-all duration-300 ease-in-out z-40 origin-top pt-6 pb-8',
          isOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
        ].join(' ')}
      >
        <div className="grid grid-cols-2 gap-8 px-8">
          {NAV_CATEGORIES.map((section) => (
            <div key={section.heading}>
              <Link
                href={section.href}
                className="block text-headline-sm text-on-surface mb-4 hover:text-primary transition-colors"
              >
                {section.heading}
              </Link>
              <ul className="space-y-3">
                {section.items.map((sub) => (
                  <li key={sub.label}>
                    <Link
                      href={sub.href}
                      className="flex items-center text-body-md text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined mr-2 text-tertiary">
                        {sub.icon}
                      </span>
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
