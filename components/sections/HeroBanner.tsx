import Image from 'next/image';
import Link from 'next/link';

export default function HeroBanner() {
  return (
    <>
      {/* Desktop hero */}
      <section className="hidden md:flex w-full rounded-2xl overflow-hidden shadow-sm relative h-[400px] items-center bg-surface-container-low">
        <Image
          src="https://images.unsplash.com/photo-1546377791-2e01b4449bf0?w=1600&q=80&fit=crop"
          alt="히어로 배너"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="relative z-10 p-12 bg-white/70 backdrop-blur-sm rounded-xl ml-12 max-w-lg">
          <h2 className="text-headline-lg text-on-surface mb-4">
            반려동물에게 특별한 선물을
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-6">
            엄선된 프리미엄 장난감, 간식, 케어 용품을 만나보세요.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-primary-container text-white px-8 py-3 rounded-full text-label-md hover:opacity-90 transition-opacity shadow-sm"
          >
            쇼핑하기
          </Link>
        </div>
      </section>

      {/* Mobile hero */}
      <section className="md:hidden relative w-full aspect-[4/3] bg-surface-container overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1546377791-2e01b4449bf0?w=1600&q=80&fit=crop"
          alt="히어로 배너"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-margin-mobile pb-8">
          <h2 className="text-headline-lg-mobile text-on-primary mb-2">
            반려동물의 행복한 일상
          </h2>
          <p className="text-body-md text-surface-bright mb-6 max-w-sm">
            건강하고 맛있는 간식부터 포근한 생활용품까지 한 곳에서.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-primary-container text-on-primary text-label-md py-3 px-6 rounded-lg w-full max-w-[200px] text-center shadow-sm active:scale-95 transition-transform duration-150"
          >
            쇼핑하기
          </Link>
        </div>
      </section>
    </>
  );
}
