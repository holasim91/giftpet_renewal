'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/actions/cart';
import { useToast } from '@/components/ui/Toast';

interface Props {
  productId: string;
  disabled?: boolean;
}

export default function AddToCartButton({ productId, disabled = false }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    startTransition(async () => {
      const result = await addToCart(productId, 1);
      if (result?.error) {
        router.push('/auth/login');
      } else {
        showToast('장바구니에 추가되었습니다', 'success');
        router.refresh();
      }
    });
  };

  if (disabled) {
    return (
      <div className="hidden md:block bg-surface-container text-tertiary px-4 py-1.5 rounded-full text-[12px] text-label-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-not-allowed select-none">
        품절
      </div>
    );
  }

  return (
    <div
      role="button"
      onClick={handleClick}
      className="hidden md:block bg-primary-container text-white px-4 py-1.5 rounded-full text-[12px] text-label-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer select-none"
    >
      {isPending ? '...' : 'Add to Cart'}
    </div>
  );
}
