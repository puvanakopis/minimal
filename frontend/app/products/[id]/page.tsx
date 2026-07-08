import { notFound } from 'next/navigation';
import ProductImage from './_components/ProductImage';
import ProductDetails from './_components/ProductDetails';
import { getProductById } from '@/data/products';

export async function generateStaticParams() {
  const ids = ['1', '2', '3', '4'];
  return ids.map((id) => ({ id }));
}

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductById(parseInt(resolvedParams.id));

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-background-light transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-10 py-8 lg:py-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Product Images */}
          <ProductImage product={product} />

          {/* Right Column - Product Details */}
          <ProductDetails product={product} />
        </div>
      </div>
    </main>
  );
}