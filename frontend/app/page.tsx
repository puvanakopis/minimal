import Hero from './_components/Hero';
import CollectionGrid from './_components/CollectionGrid';
import FeaturedProducts from './_components/FeaturedProducts';
import JournalSection from './_components/JournalSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <CollectionGrid />
      <FeaturedProducts />
      <JournalSection />
    </main>
  );
}