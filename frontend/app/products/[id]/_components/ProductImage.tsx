'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/interfaces';
import { getImageUrl } from '@/helper/image';

interface ProductImageProps {
  product: Product;
}

export default function ProductImage({ product }: ProductImageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const rawImages = (product.images && product.images.length > 0)
    ? product.images
    : [product.mainImage || product.image].filter(Boolean);

  const thumbnails = rawImages.length > 0 ? rawImages : ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6'];
  const currentImage = thumbnails[selectedImage] || thumbnails[0];

  return (
    <div className="flex flex-col sm:flex-row gap-4 h-full sm:h-[550px]">
      {thumbnails.length > 1 && (
        <div className="flex flex-row sm:flex-col gap-3 order-2 sm:order-1 sm:w-20 shrink-0 overflow-x-auto sm:overflow-y-auto pb-2 sm:pb-0 no-scrollbar">
          {thumbnails.map((image, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(idx)}
              className={`
                aspect-square w-20 sm:w-full shrink-0 overflow-hidden rounded-lg
                border-2 transition-all duration-200 cursor-pointer
                ${selectedImage === idx
                  ? 'border-brand-teal ring-2 ring-brand-teal/20'
                  : 'border-[#e7f1f3] hover:border-brand-teal'
                }
              `}
            >
              <Image
                src={getImageUrl(image)}
                alt={`${product.name} - view ${idx + 1}`}
                width={120}
                height={150}
                unoptimized
                className={`
                  w-full h-full object-cover transition-all duration-300
                  ${selectedImage !== idx ? 'grayscale opacity-75 hover:grayscale-0 hover:opacity-100' : ''}
                `}
              />
            </button>
          ))}
        </div>
      )}

      <div
        className={`
          flex-1 bg-gray-100 rounded-2xl overflow-hidden h-[400px] sm:h-full relative border border-gray-100`}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <div className="relative w-full h-full">
          <Image
            src={getImageUrl(currentImage)}
            alt={product.name}
            fill
            unoptimized
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