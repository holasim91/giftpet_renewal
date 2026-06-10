import HeroBanner from '@/components/sections/HeroBanner';
import CategoryPills from '@/components/sections/CategoryPills';
import NewArrivals from '@/components/sections/NewArrivals';
import MdRecommendation from '@/components/sections/MdRecommendation';
import { getNewArrivals, getMdPickProducts } from '@/actions/product';

export default async function HomePage() {
  const [newArrivals, mdPicks] = await Promise.all([
    getNewArrivals(8),
    getMdPickProducts(),
  ]);

  return (
    <main className="flex-1 w-full md:max-w-container md:mx-auto md:px-margin-desktop md:py-8 md:space-y-16">
      <HeroBanner />
      <CategoryPills />
      <NewArrivals products={newArrivals} />
      <MdRecommendation products={mdPicks} />
    </main>
  );
}
