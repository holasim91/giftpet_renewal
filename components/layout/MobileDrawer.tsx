'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Session } from 'next-auth';
import SignOutButton from '@/components/ui/SignOutButton';
import { NAV_CATEGORIES, PRODUCT_CATEGORIES } from '@/lib/constants';
import type { NavCategory } from '@/lib/constants';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

type AnimalKey = NavCategory['key'];

export default function MobileDrawer({ isOpen, onClose, session }: MobileDrawerProps) {
  const displayName = session?.user?.name ?? session?.user?.email?.split('@')[0];
  const [openAnimal, setOpenAnimal] = useState<AnimalKey | null>(null);

  const toggleAnimal = (animal: AnimalKey) => {
    setOpenAnimal((prev) => (prev === animal ? null : animal));
  };

  return (
    <>
      {/* Overlay — aria-hidden은 닫혀있을 때만 true (열리면 인터랙티브 요소이므로) */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 left-0 w-[280px] bg-surface z-50 transform transition-transform duration-300 flex flex-col shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <span className="text-headline-sm text-on-surface">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">

          {/* 모든 카테고리 */}
          <Link
            href="/shop"
            className="px-4 py-3.5 text-label-md text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors border-b border-surface-container-high"
            onClick={onClose}
          >
            모든 카테고리
          </Link>

          {/* 동물별 카테고리 — 아코디언 */}
          {NAV_CATEGORIES.map((category) => (
            <div key={category.key} className="border-b border-surface-container-high">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3.5 text-label-md text-on-surface hover:text-primary transition-colors"
                onClick={() => toggleAnimal(category.key)}
              >
                {category.heading}
                <span
                  className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${
                    openAnimal === category.key ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {openAnimal === category.key && (
                <ul className="pb-2 bg-surface-container-lowest">
                  {category.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 pl-7 pr-4 py-2.5 text-body-md text-on-surface-variant hover:text-primary transition-colors"
                        onClick={onClose}
                      >
                        <span className="text-tertiary text-[12px]">ㄴ</span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* 구분선 — 공통 카테고리 */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-label-sm text-tertiary uppercase tracking-wider">카테고리</p>
          </div>

          {PRODUCT_CATEGORIES.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-3 text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors border-b border-surface-container-high"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}

        </div>

        {/* Bottom: Login / User */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant">
          {session ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
                <span className="text-body-md text-on-surface">{displayName}</span>
              </div>
              <SignOutButton className="text-label-md text-primary hover:underline" />
            </div>
          ) : (
            <Link
              href="/auth/login"
              onClick={onClose}
              className="flex items-center space-x-3 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
              <span className="text-body-md text-on-surface">로그인 / 회원가입</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
