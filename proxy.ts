import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// /cart·/mypage·/wishlist 경로는 로그인 필수. 비로그인 유저는 /auth/login으로 리다이렉트.
export default auth((req) => {
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ['/cart/:path*', '/mypage/:path*', '/mypage', '/wishlist/:path*', '/wishlist', '/checkout'],
};
