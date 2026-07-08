'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/data/products';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const handleAddToCart = () => {
    console.log('Added to cart:', {
      product,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex flex-wrap text-xs uppercase tracking-widest text-[#4e8b97] gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-primary transition-colors">
              Shop
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {product.category}
            </Link>
          </li>
          <li>/</li>
          <li
            className="hover:text-primary transition-colors capitalize"
          >
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold italic tracking-tight mb-4 leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center text-brand-teal">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="material-symbols-outlined text-base">
              {i < Math.floor(product.rating || 0)
                ? 'star'
                : i < (product.rating || 0)
                  ? 'star_half'
                  : 'star'}
            </span>
          ))}
        </div>

        <span className="text-xs uppercase tracking-widest text-[#4e8b97] font-medium">
          ({product.reviewCount || 0} Reviews)
        </span>
      </div>

      {/* Price */}
      <p className="text-2xl font-light mb-8 tracking-tight">
        Rs. {product.price.toLocaleString()}
      </p>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em]">
              Color:{' '}
              <span className="font-normal normal-case ml-1 text-[#4e8b97]">
                {selectedColor?.name}
              </span>
            </h4>
          </div>

          <div className="flex gap-4">
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color)}
                className={`
                  size-10 rounded-full transition-all duration-200
                  ${selectedColor?.id === color.id
                    ? 'ring-2 ring-brand-teal ring-offset-4'
                    : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                  }
                `}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em]">
              Select Size
            </h4>

            <button className="text-[10px] uppercase tracking-widest font-bold text-brand-teal border-b border-brand-teal/30 hover:border-brand-teal transition-all">
              Size Guide
            </button>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  py-4 text-xs font-medium transition-all duration-200 border
                  ${selectedSize === size
                    ? 'border-brand-teal bg-brand-teal text-white font-bold'
                    : 'border-[#e7f1f3] hover:border-brand-teal'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4">
          Quantity
        </h4>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="size-10 border border-[#e7f1f3] hover:border-brand-teal transition-colors"
          >
            -
          </button>

          <span className="w-12 text-center font-medium">{quantity}</span>

          <button
            onClick={() => setQuantity(quantity + 1)}
            className="size-10 border border-[#e7f1f3] hover:border-brand-teal transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-12">
        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="flex-1 py-5 bg-brand-teal text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1499b5] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">
            shopping_bag
          </span>
          <span>Add to Cart</span>
        </button>

        {/* Favorites */}
        <button
          className="flex-1 py-5 bg-brand-teal text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1499b5] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">
            favorite
          </span>
          <span>Add to Favorites</span>
        </button>
      </div>

      {/* Accordion Details */}
      <div className="border-t border-[#e7f1f3]">
        {/* Product Details Accordion */}
        <div className="border-b border-[#e7f1f3] py-6">
          <button
            onClick={() => toggleAccordion('details')}
            className="flex justify-between items-center w-full group"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.1em]">
              Product Details
            </h4>

            <span
              className={`material-symbols-outlined text-xl transition-transform duration-300 ${activeAccordion === 'details' ? 'rotate-180' : ''
                }`}
            >
              expand_more
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'details' ? 'max-h-96' : 'max-h-0'
              }`}
          >
            <div className="pt-4 text-sm text-[#4e8b97] leading-relaxed">
              <p>{product.description}</p>

              {product.details && product.details.length > 0 && (
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Material & Care Accordion */}
        <div className="border-b border-[#e7f1f3]">
          <button
            onClick={() => toggleAccordion('care')}
            className="flex justify-between items-center w-full group"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.1em]">
              Material &amp; Care
            </h4>

            <span
              className={`material-symbols-outlined text-xl transition-transform duration-300 ${activeAccordion === 'care' ? 'rotate-180' : ''
                }`}
            >
              expand_more
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'care' ? 'max-h-96' : 'max-h-0'
              }`}
          >
            <div className="pt-4 text-sm text-[#4e8b97] leading-relaxed">
              <p>{product.material}</p>

              {product.careInstructions &&
                product.careInstructions.length > 0 && (
                  <>
                    <p className="mt-2 font-semibold">
                      Care Instructions:
                    </p>

                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      {product.careInstructions.map((care, idx) => (
                        <li key={idx}>{care}</li>
                      ))}
                    </ul>
                  </>
                )}
            </div>
          </div>
        </div>

        {/* Shipping & Returns Accordion */}
        <div className="border-b border-[#e7f1f3] py-6">
          <button
            onClick={() => toggleAccordion('shipping')}
            className="flex justify-between items-center w-full group"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.1em]">
              Shipping &amp; Returns
            </h4>

            <span
              className={`material-symbols-outlined text-xl transition-transform duration-300 ${activeAccordion === 'shipping' ? 'rotate-180' : ''
                }`}
            >
              expand_more
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${activeAccordion === 'shipping' ? 'max-h-96' : 'max-h-0'
              }`}
          >
            <div className="pt-4 text-sm text-[#4e8b97] leading-relaxed">
              <p>
                Free standard shipping on all orders over Rs. 25,000.
                Delivered within 3-5 business days.
              </p>

              <p className="mt-2">
                Returns are accepted within 30 days of purchase.
                Items must be in original condition with tags attached.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}