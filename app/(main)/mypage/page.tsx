import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import MypageClient from './MypageClient';

export const metadata: Metadata = {
  title: '마이페이지 | GIFT PET',
};

export default async function MypagePage() {
  const session = await auth();
  if (!session) redirect('/auth/login?callbackUrl=/mypage');

  return (
    <MypageClient
      name={session.user.name ?? ''}
      email={session.user.email}
    />
  );
}
