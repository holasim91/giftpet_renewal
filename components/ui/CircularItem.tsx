import Image from 'next/image';
import type { CircularRecommendation } from '@/types';

interface CircularItemProps {
  item: CircularRecommendation;
}

export default function CircularItem({ item }: CircularItemProps) {
  return (
    <button type="button" className="flex flex-col items-center group cursor-pointer">
      {/* Circle — desktop: bgColor + border-white + centered small image */}
      {/*          mobile: bg-surface-container + thin border + fill image */}
      <div
        className={[
          'relative rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-shadow',
          'w-20 h-20 md:w-32 md:h-32',
          'border border-outline-variant/30 md:border-4 md:border-white',
          item.bgColor,
        ].join(' ')}
      >
        <Image
          src={item.imageUrl}
          alt={item.label}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 128px, 80px"
        />
      </div>

      <span className="text-label-md text-on-surface text-center font-semibold max-w-[100px] mt-4">
        {item.label}
      </span>
    </button>
  );
}
