'use client';

import ProfileCard from '@/components/mypage/ProfileCard';
import NameChangeForm from '@/components/mypage/NameChangeForm';
import PasswordModal from '@/components/mypage/PasswordModal';
import OrderHistory from '@/components/mypage/OrderHistory';

interface Props {
  name: string;
  email: string;
}

export default function MypageClient({ name, email }: Props) {
  return (
    <main className="max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      <ProfileCard name={name} email={email} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <NameChangeForm initialName={name} />
          <PasswordModal />
        </div>
        <div className="lg:col-span-2">
          <OrderHistory />
        </div>
      </div>
    </main>
  );
}
