'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { loginUser } from '@/actions/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const result = await loginUser(email, password);
      if (!result.success) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-8">
        {/* 로고 */}
        <Link href="/" className="block text-center mb-8">
          <span className="text-headline-md text-primary font-bold tracking-tight">
            GIFT PET
          </span>
        </Link>

        <h1 className="text-headline-sm text-on-surface mb-6 text-center">
          로그인
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-label-md text-on-surface">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="example@email.com"
              className="bg-surface-container rounded-lg px-4 py-3 text-body-md text-on-surface placeholder:text-tertiary outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-label-md text-on-surface"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
              className="bg-surface-container rounded-lg px-4 py-3 text-body-md text-on-surface placeholder:text-tertiary outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {error && (
            <p className="text-label-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full bg-primary-container text-on-primary text-label-md rounded-full py-3 transition-opacity disabled:opacity-50"
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-label-md text-on-surface-variant">
          계정이 없으신가요?{' '}
          <Link
            href="/auth/register"
            className="text-primary hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
