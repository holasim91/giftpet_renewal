import Link from 'next/link';
import { auth } from '@/auth';
import SignOutButton from '@/components/ui/SignOutButton';
import { getCartCount } from '@/actions/cart';
import { NAV_CATEGORIES, PRODUCT_CATEGORIES } from '@/lib/constants';

interface NavItem {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
}

// GNB 항목 — '모든 카테고리'만 메가메뉴 트리거. 나머지는 공유 카테고리 상수에서 파생.
const NAV_ITEMS: NavItem[] = [
  { label: '모든 카테고리', href: '/shop', hasMegaMenu: true },
  ...NAV_CATEGORIES.map((c) => ({ label: c.heading, href: c.href })),
  ...PRODUCT_CATEGORIES,
];

export default async function Header() {
  const session = await auth();
  const displayName = session?.user?.name ?? session?.user?.email?.split('@')[0];
  const cartCount = await getCartCount();
  return (
    <header className="hidden md:block bg-surface border-b border-outline-variant shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sticky top-0 z-50 w-full">
      {/* Inner container — relative 유지 (메가메뉴 절대위치 기준점), group 제거 */}
      <div className="flex flex-col w-full px-margin-desktop max-w-container mx-auto space-y-4 py-4 relative">

        {/* Row 1: Logo + Utility Icons */}
        <div className="flex justify-between items-center w-full">
          <div className="w-1/3" />
          <div className="w-1/3 flex justify-center">
            <Link href="/" className="text-headline-xl text-on-surface tracking-tighter">
              GIFT PET
            </Link>
          </div>
          <div className="w-1/3 flex justify-end items-center gap-6 text-on-surface">

            {/* Person — 비로그인: 아이콘 링크 / 로그인: 드롭다운 */}
            {session ? (
              <div className="group relative flex items-center">
                {/* Trigger */}
                <div className="flex items-center gap-1.5 cursor-pointer text-on-surface hover:text-primary transition-colors duration-200 ease-out select-none">
                  <span className="material-symbols-outlined text-[28px]">person</span>
                  <span className="text-label-md">{displayName}</span>
                </div>

                {/* pt-1: 투명 버퍼 — trigger → dropdown 이동 시 hover 유지 */}
                <div className="absolute top-full right-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                  <div className="min-w-[180px] bg-surface-container-lowest rounded-xl shadow-[0px_8px_30px_rgba(0,0,0,0.1)] border border-outline-variant py-3 px-4">
                    <p className="text-label-md text-on-surface whitespace-nowrap">
                      안녕하세요, {displayName}님
                    </p>
                    <div className="mt-3 pt-3 border-t border-outline-variant flex flex-col gap-2">
                      <Link
                        href="/mypage"
                        className="text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200"
                      >
                        마이페이지
                      </Link>
                      <SignOutButton className="w-full text-left text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" aria-label="로그인" className="flex items-center hover:text-primary transition-colors duration-200 ease-out">
                <span className="material-symbols-outlined text-[28px]">person</span>
              </Link>
            )}

            <button type="button" aria-label="찜" className="flex items-center hover:text-primary transition-colors duration-200 ease-out">
              <span className="material-symbols-outlined text-[28px]">favorite</span>
            </button>
            <Link href="/cart" aria-label="장바구니" className="flex items-center hover:text-primary transition-colors duration-200 ease-out relative">
              <span className="material-symbols-outlined text-[28px]">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-container text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>

        {/* TODO: 검색 기능 구현 예정
            검색창 UI는 구현되어 있으나 기능 미구현으로 임시 비활성화 */}
        {/* <div className="flex justify-center w-full">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary">search</span>
            <input
              type="search"
              placeholder="Search"
              className="w-full bg-surface-container rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary border-none text-body-md transition-shadow"
            />
          </div>
        </div> */}

        {/* Row 3: GNB — self-center로 텍스트 너비에 맞게 축소, relative로 메가메뉴 기준점 */}
        <nav className="flex items-center space-x-8 self-center relative">
          {NAV_ITEMS.map((item) =>
            item.hasMegaMenu ? (
              // '모든 카테고리' — group만, relative 없음 → 메가메뉴는 inner container(relative) 기준으로 포지셔닝
              <div key={item.label} className="group">
                <Link
                  href={item.href}
                  className="block text-label-md tracking-wider uppercase text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 ease-out"
                >
                  {item.label}
                </Link>

                {/* 메가메뉴 — nav 텍스트 너비 기준, 헤더 최하단 정렬 (inner container pb-4=1rem 오프셋) */}
                <div className="absolute top-[calc(100%+1rem)] left-0 w-full bg-white shadow-[0px_10px_30px_rgba(0,0,0,0.1)] rounded-b-xl border-t border-surface-container opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-40 origin-top pt-6 pb-8">
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
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-label-md tracking-wider uppercase text-on-surface-variant font-medium hover:text-primary transition-colors duration-200 ease-out"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

      </div>
    </header>
  );
}
