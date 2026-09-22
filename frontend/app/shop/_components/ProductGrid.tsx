'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/interfaces';
import { ChevronDown } from 'lucide-react';

interface ProductGridProps {
    products: Product[];
    currentPage: number;
    productsPerPage: number;
    loading?: boolean;
    sortBy?: string;
    onSortChange?: (value: string) => void;
}

export default function ProductGrid({
    products,
    currentPage,
    productsPerPage,
    loading = false,
    sortBy = 'newest',
    onSortChange,
}: ProductGridProps) {
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
                            onChange={(e) => onSortChange?.(e.target.value)}
                            className="bg-transparent border-none text-xs uppercase tracking-widest cursor-pointer py-0 pr-8 appearance-none focus:outline-none focus:ring-0 focus:border-none"
                        >
                            <option value="newest">Newest Arrivals</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Rating</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
                    </div>
                </div>
            </motion.div>

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="animate-pulse space-y-4">
                            <div className="aspect-[4/5] bg-gray-100 rounded-lg"></div>
                            <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/4 mx-auto"></div>
                        </div>
                    ))}
                </div>
            ) : totalProducts === 0 ? (
                <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-[#4e8b97] text-sm italic mb-2">No products found matching your filters.</p>
                    <p className="text-xs text-gray-400">Try adjusting your filters or browse other categories.</p>
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
                                category={product.category}
                                price={product.price}
                                image={product.image || product.mainImage || ''}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
}