/**
 * prisma/seed.ts — GIFT PET 더미 데이터 시딩
 *
 * 실행: pnpm prisma db seed
 *   (package.json "prisma.seed" 에 의해 tsx로 실행됨)
 *
 * 특이사항:
 *   - seed 환경에서 Next.js의 .env.local 자동 로드가 없으므로 dotenv로 수동 로드
 *   - Prisma 7 방식: PrismaPg 어댑터 + DATABASE_URL 직접 주입
 *   - 실행 전 기존 Cart → Product 순서로 초기화(idempotent)
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// .env.local 로드 (seed 실행 시 Next.js가 아닌 Node 환경이므로 명시 필요)
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL이 설정되지 않았습니다. .env.local을 확인하세요.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ─── 헬퍼 ────────────────────────────────────────────────────────────────────

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

// ─── 시드 데이터 ─────────────────────────────────────────────────────────────
// createdAt 기준:
//   신상품 (5개, 30일 이내): NEW 배지 상품 4개 + 최근 등록 1개
//   구상품 (10개, 30일 이전)

const PRODUCTS = [
  // ── 강아지 사료 4개 ────────────────────────────────────────────────────────
  {
    name: '오리젠 오리지날 그레인프리 소고기&연어 800g',
    description: '신선한 소고기와 연어로 만든 그레인프리 프리미엄 강아지 사료.',
    detailContent: null,
    price: 28000,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    stock: 45,
    animalCategory: 'dog' as const,
    productCategory: 'food' as const,
    isBest: true,
    isMdPick: true,
    createdAt: daysAgo(45),
  },
  {
    name: '네츄럴코어 유기농 치킨 1.2kg',
    description: '100% 유기농 인증 원료로 만든 강아지 건식 사료.',
    detailContent: null,
    price: 34000,
    discountPrice: 28900,
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80',
    stock: 30,
    animalCategory: 'dog' as const,
    productCategory: 'food' as const,
    createdAt: daysAgo(5),
  },
  {
    name: '아카나 퍼시픽 필하드 340g',
    description: '태평양 생선을 주원료로 한 고단백 그레인프리 사료.',
    detailContent: null,
    price: 16500,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1601758124277-f0086d5ab050?w=400&h=400&fit=crop',
    stock: 55,
    animalCategory: 'dog' as const,
    productCategory: 'food' as const,
    createdAt: daysAgo(20),
  },
  {
    name: '힐스 사이언스 다이어트 어덜트 1.5kg',
    description: '수의사 추천 1위 브랜드, 균형 잡힌 영양의 강아지 건식 사료.',
    detailContent: null,
    price: 42000,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    stock: 0,
    animalCategory: 'dog' as const,
    productCategory: 'food' as const,
    isBest: true,
    createdAt: daysAgo(60),
  },

  // ── 강아지 간식 3개 ────────────────────────────────────────────────────────
  {
    name: '위시츄 덴탈 츄 스트로베리향 100g',
    description: '스트로베리향으로 치석 제거와 구취 개선을 돕는 덴탈 간식.',
    detailContent: null,
    price: 8500,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
    stock: 80,
    animalCategory: 'dog' as const,
    productCategory: 'treats' as const,
    createdAt: daysAgo(12),
  },
  {
    name: '져스트 드라이드 치킨 저키 120g',
    description: '저온 건조 공법으로 만든 100% 닭가슴살 간식.',
    detailContent: null,
    price: 13500,
    discountPrice: 11900,
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80',
    stock: 65,
    animalCategory: 'dog' as const,
    productCategory: 'treats' as const,
    isBest: true,
    isMdPick: true,
    createdAt: daysAgo(90),
  },
  {
    name: '퍼피러브 소프트 트릿 믹스 200g',
    description: '훈련용으로 적합한 소프트 타입 반건조 간식 세트.',
    detailContent: null,
    price: 12000,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80',
    stock: 40,
    animalCategory: 'dog' as const,
    productCategory: 'treats' as const,
    createdAt: daysAgo(35),
  },

  // ── 강아지 용품 2개 ────────────────────────────────────────────────────────
  {
    name: '헬로마이펫 댕댕 발세정제 300ml',
    description: '산책 후 발바닥 오염을 간편하게 씻어주는 폼 타입 세정제.',
    detailContent: null,
    price: 18000,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&q=80',
    stock: 35,
    animalCategory: 'dog' as const,
    productCategory: 'supplies' as const,
    createdAt: daysAgo(50),
  },
  {
    name: '강아지 쿨링 매트 M 그레이',
    description: '자연 냉감 소재로 여름철 체온 조절을 돕는 쿨링 매트.',
    detailContent: null,
    price: 32000,
    discountPrice: 26900,
    imageUrl: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=600&q=80',
    stock: 20,
    animalCategory: 'dog' as const,
    productCategory: 'supplies' as const,
    createdAt: daysAgo(75),
  },

  // ── 강아지 영양제 2개 ──────────────────────────────────────────────────────
  {
    name: '트럼펫 소프트클로버 이뮨부스터 60g',
    description: '프로폴리스·초유 분말로 반려견 면역력을 강화하는 영양 간식형 영양제.',
    detailContent: null,
    price: 24000,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&q=80',
    stock: 50,
    animalCategory: 'dog' as const,
    productCategory: 'supplements' as const,
    isBest: true,
    isMdPick: true,
    createdAt: daysAgo(55),
  },
  {
    name: '오메가3 피시오일 강아지용 60캡슐',
    description: '피부·피모 건강과 관절 유연성 개선을 위한 천연 오메가3 캡슐.',
    detailContent: null,
    price: 19000,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&q=80',
    stock: 45,
    animalCategory: 'dog' as const,
    productCategory: 'supplements' as const,
    createdAt: daysAgo(65),
  },

  // ── 고양이 간식 2개 ────────────────────────────────────────────────────────
  {
    name: '이나바 치루 참치&닭 14g×4',
    description: '짜먹는 타입의 고단백 고양이 간식, 수분 보충에도 효과적.',
    detailContent: null,
    price: 7500,
    discountPrice: 6400,
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
    stock: 90,
    animalCategory: 'cat' as const,
    productCategory: 'treats' as const,
    isBest: true,
    isMdPick: true,
    createdAt: daysAgo(80),
  },
  {
    name: '테비 참치 퓨레 15g×6',
    description: '천연 참치살로 만든 낮은 칼로리의 퓨레 타입 고양이 간식.',
    detailContent: null,
    price: 9800,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&q=80',
    stock: 70,
    animalCategory: 'cat' as const,
    productCategory: 'treats' as const,
    createdAt: daysAgo(8),
  },

  // ── 고양이 용품 2개 ────────────────────────────────────────────────────────
  {
    name: '냥이조아 스크래처 웨이브 보드',
    description: '물결 모양의 골판지 스크래처로 발톱 관리와 스트레스 해소.',
    detailContent: null,
    price: 14000,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80',
    stock: 25,
    animalCategory: 'cat' as const,
    productCategory: 'supplies' as const,
    createdAt: daysAgo(100),
  },
  {
    name: '라비오뜨 자동 급수기 1.5L',
    description: '정수 필터 내장 자동 순환 급수기로 고양이의 신선한 음수를 돕는다.',
    detailContent: null,
    price: 29000,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80',
    stock: 15,
    animalCategory: 'cat' as const,
    productCategory: 'supplies' as const,
    createdAt: daysAgo(25),
  },
];

// ─── 메인 ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 GIFT PET 데이터 시딩 시작\n');

  // 외래 키 참조 순서: Cart → Wishlist → Product
  const cartCount = await prisma.cart.deleteMany();
  const wishlistCount = await prisma.wishlist.deleteMany();
  const productCount = await prisma.product.deleteMany();
  console.log(`🗑️  기존 데이터 삭제: Cart ${cartCount.count}건, Wishlist ${wishlistCount.count}건, Product ${productCount.count}건`);

  const result = await prisma.product.createMany({
    data: PRODUCTS.map((p) => ({ ...p })),
  });

  console.log(`✅ 상품 ${result.count}개 시딩 완료\n`);
  console.log('── 구성 ────────────────────────────');
  console.log('  강아지 사료    4개 (품절 1 포함)');
  console.log('  강아지 간식    3개');
  console.log('  강아지 용품    2개');
  console.log('  강아지 영양제  2개');
  console.log('  고양이 간식    2개');
  console.log('  고양이 용품    2개');
  console.log('────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
