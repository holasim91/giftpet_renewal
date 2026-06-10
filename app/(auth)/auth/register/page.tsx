'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { registerUser } from '@/actions/auth';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

const baseInput =
  'w-full bg-surface-container rounded-lg px-4 py-3 text-body-md text-on-surface placeholder:text-tertiary outline-none focus:ring-2 focus:ring-primary/30';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({ mode: 'onTouched' });

  const passwordValue = watch('password', '');
  const confirmValue = watch('confirmPassword', '');
  // watch 값 직접 비교 — validation 타이밍과 무관하게 즉시 반영
  const confirmMatch = confirmValue.length > 0 && confirmValue === passwordValue;

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await registerUser(data.email, data.password, data.name);
      if (!result.success) {
        setError('email', { message: result.error });
      } else {
        router.push('/auth/login');
      }
    });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-margin-mobile py-10">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-8">
        <Link href="/" className="block text-center mb-8">
          <span className="text-headline-md text-primary font-bold tracking-tight">
            GIFT PET
          </span>
        </Link>

        <h1 className="text-headline-sm text-on-surface mb-6 text-center">
          회원가입
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* 이름 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-label-md text-on-surface">
              이름
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="이름을 입력하세요"
              className={`${baseInput} ${errors.name ? 'ring-2 ring-error/30' : ''}`}
              {...register('name', {
                required: '이름을 입력해주세요.',
                minLength: { value: 1, message: '이름을 입력해주세요.' },
              })}
            />
            {errors.name && (
              <p className="text-label-sm text-error">{errors.name.message}</p>
            )}
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-label-md text-on-surface">
              이메일
            </label>
            <input
              id="email"
              type="text"
              autoComplete="email"
              placeholder="example@email.com"
              className={`${baseInput} ${errors.email ? 'ring-2 ring-error/30' : ''}`}
              {...register('email', {
                required: '이메일을 입력해주세요.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '올바른 이메일 형식을 입력해주세요.',
                },
              })}
            />
            {errors.email && (
              <p className="text-label-sm text-error">{errors.email.message}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-label-md text-on-surface">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="8자 이상 입력하세요"
                className={`${baseInput} pr-11 ${errors.password ? 'ring-2 ring-error/30' : ''}`}
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                  minLength: {
                    value: 8,
                    message: '비밀번호는 8자 이상이어야 합니다.',
                  },
                  onChange: () => {
                    if (confirmValue) trigger('confirmPassword');
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-on-surface"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="text-label-sm text-error">{errors.password.message}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-label-md text-on-surface">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="비밀번호를 다시 입력하세요"
                className={`${baseInput} pr-11 ${errors.confirmPassword ? 'ring-2 ring-error/30' : confirmMatch ? 'ring-2 ring-green-500/30' : ''}`}
                {...register('confirmPassword', {
                  required: '비밀번호 확인을 입력해주세요.',
                  validate: (value) =>
                    value === passwordValue || '비밀번호가 일치하지 않습니다.',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-on-surface"
                aria-label={showConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showConfirm ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-label-sm text-error">{errors.confirmPassword.message}</p>
            )}
            {confirmMatch && (
              <p className="text-label-sm text-green-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                비밀번호가 일치합니다.
              </p>
            )}
          </div>

          {/* 약관 동의 */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-outline-variant accent-primary-container"
                {...register('agreed', { required: '이용약관에 동의해주세요.' })}
              />
              <span className="text-label-md text-on-surface-variant">
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  이용약관
                </Link>
                {' 및 '}
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  개인정보처리방침
                </Link>
                에 동의합니다
              </span>
            </label>
            {errors.agreed && (
              <p className="text-label-sm text-error">{errors.agreed.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full bg-primary-container text-on-primary text-label-md rounded-full py-3 transition-opacity disabled:opacity-50"
          >
            {isPending ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <p className="mt-6 text-center text-label-md text-on-surface-variant">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
