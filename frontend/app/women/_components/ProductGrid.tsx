'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/data/products';
import { ChevronDown } from 'lucide-react';

interface ProductGridProps {
    products: Product[];
    currentPage: number;
    productsPerPage: number;
}

export default function ProductGrid({
    products,
    currentPage,
    productsPerPage,
}: ProductGridProps) {
    const [sortBy, setSortBy] = useState('Newest Arrivals');

    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = products.slice(
        startIndex,
        startIndex + productsPerPage
    );
    const totalProducts = products.length;
    const showingCount = paginatedProducts.length;
    const showingStart = totalProducts > 0 ? startIndex + 1 : 0;
    const showingEnd = startIndex + showingCount;

    return (
        <>
            {/* Results count + Sort */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex justify-between items-center mb-8 pb-4 border-b border-[#e7f1f3]"
            >
                <p className="text-xs text-[#4e8b97] uppercase tracking-widest">
                    Showing {showingStart}-{showingEnd} of {totalProducts} products
                </p>
                <div className="flex items-center gap-4">
                    <span className="text-xs uppercase tracking-widest font-bold">
                        Sort By:
                    </span>
                    <div className="relative flex items-center">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent border-none text-xs uppercase tracking-widest cursor-pointer py-0 pr-8 appearance-none focus:outline-none focus:ring-0 focus:border-none"
                        >
                            <option>Newest Arrivals</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Recommended</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
                    </div>
                </div>
            </motion.div>

            {/* Product Grid */}
            {totalProducts === 0 ? (
                <div className="text-center py-20">
                    <p className="text-[#4e8b97] text-sm italic">No products found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                    {paginatedProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: (index % 3) * 0.12 }}
                        >
                            <ProductCard
                                id={product.id}
                                title={product.name}
                                color={product.colors?.[0]?.name || 'Standard'}
                                price={product.price}
                                image={product.image}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
}
