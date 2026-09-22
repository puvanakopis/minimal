import { notFound } from 'next/navigation';
import ProductImage from './_components/ProductImage';
import ProductDetails from './_components/ProductDetails';
import { productService } from '@/services';
import { Product } from '@/interfaces';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const idOrSlug = resolvedParams.id;

  let product: Product | null = null;

  try {
    if (/^\d+$/.test(idOrSlug)) {
      const response = await productService.getProductById(idOrSlug);
      if (response.success && response.data) {
        product = response.data;
      }
    } else {
      const response = await productService.getProductBySlug(idOrSlug);
      if (response.success && response.data) {
        product = response.data;
      }
    }
  } catch (error) {
    console.error('Error fetching product from backend:', error);
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-background-light min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10 lg:py-16">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Column - Product Images */}
          <ProductImage product={product} />

          {/* Right Column - Product Details */}
          <ProductDetails product={product} />
        </div>
      </div>
    </main>
  );
}