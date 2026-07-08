'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/data/products';

interface ProductImageProps {
  product: Product;
}

export default function ProductImage({ product }: ProductImageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const thumbnails = product.images && product.images.length > 0
    ? product.images
    : [product.mainImage || product.image];

  const currentImage = (thumbnails[selectedImage] || product.mainImage || product.image) as string;

  return (
    <div className="flex flex-col sm:flex-row gap-4 h-full sm:h-[550px]">
      <div className="flex flex-row sm:flex-col gap-3 order-2 sm:order-1 sm:w-20 shrink-0 overflow-y-auto sm:overflow-y-auto pb-2 sm:pb-0 no-scrollbar">
        {thumbnails.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`
              aspect-square w-20 sm:w-full shrink-0 overflow-hidden
              border-2 transition-all duration-200
              ${selectedImage === idx
                ? 'border-brand-teal'
                : 'border-[#e7f1f3] hover:border-brand-teal'
              }
            `}
          >
            <Image
              src={image || product.image}
              alt={`${product.name} - view ${idx + 1}`}
              width={120}
              height={150}
              className={`
                w-full h-full object-cover transition-all duration-300
                ${selectedImage !== idx ? 'grayscale opacity-80 hover:grayscale-0 hover:opacity-100' : ''}
              `}
            />
          </button>
        ))}
      </div>

      <div
        className={`
          flex-1 bg-gray-100 overflow-hidden h-[400px] sm:h-full`}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <div className="relative w-full h-full">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className={`
              object-cover transition-transform duration-500
              ${isZoomed ? 'scale-110' : 'scale-100'}
            `}
            priority
          />
        </div>
      </div>
    </div>
  );
}