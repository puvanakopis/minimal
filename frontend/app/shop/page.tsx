'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Pagination from '@/components/Pagination';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/app/shop/_components/ProductGrid';
import Filter from '@/app/shop/_components/Filter';
import { useProducts } from '@/context';
import { Product } from '@/interfaces';

const PRODUCTS_PER_PAGE = 6;

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchQuery = searchParams.get('search') || '';

    const { getProducts } = useProducts();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Filters and sorting state
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [priceRange, setPriceRange] = useState<number>(10000);

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'All Collections', href: '/shop', isActive: !searchQuery },
        ...(searchQuery ? [{ label: `Search: "${searchQuery}"`, href: `/shop?search=${encodeURIComponent(searchQuery)}`, isActive: true }] : []),
    ];

    useEffect(() => {
        let isMounted = true;
        async function fetchAll() {
            setLoading(true);
            try {
                const response = await getProducts({
                    sortBy,
                    search: searchQuery || undefined,
                });
                if (isMounted && response.success && response.data) {
                    setProducts(response.data);
                } else if (isMounted) {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Failed to fetch products for shop:', err);
                if (isMounted) {
                    setProducts([]);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchAll();
        return () => {
            isMounted = false;
        };
    }, [sortBy, searchQuery, getProducts]);

    const handleClearSearch = () => {
        router.push('/shop');
    };

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setSelectedCategories([]);
        setSelectedSize('');
        setPriceRange(10000);
        setCurrentPage(1);
        if (searchQuery) {
            router.push('/shop');
        }
    };

    // Filter products based on selected criteria
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Category filter
            if (selectedCategories.length > 0) {
                if (!product.category || !selectedCategories.some((cat) => cat.toLowerCase() === product.category?.toLowerCase())) {
                    return false;
                }
            }
            // Size filter
            if (selectedSize) {
                const effectiveSizes = product.sizes && product.sizes.length > 0
                    ? product.sizes
                    : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
                const hasMatchingSize = effectiveSizes.some(
                    (s) => String(s).trim().toLowerCase() === selectedSize.trim().toLowerCase()
                );
                if (!hasMatchingSize) {
                    return false;
                }
            }
            // Price range filter
            if (product.price > priceRange) {
                return false;
            }
            return true;
        });
    }, [products, selectedCategories, selectedSize, priceRange]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    return (
        <main>
            {/* Breadcrumb */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-black/10 py-16 px-10 border-b border-[#e7f1f3]"
            >
                <div className="max-w-7xl mx-auto">
                    <Breadcrumb
                        items={breadcrumbItems}
                        className="mb-4"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-5xl font-serif italic tracking-tight">
                            {searchQuery ? `Search Results` : `All Collections`}
                        </h1>

                        {searchQuery && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-2xs self-start">
                                <Search className="w-4 h-4 text-brand-teal" />
                                <span className="text-xs font-semibold text-gray-700">
                                    Keyword: <strong className="text-gray-900">&ldquo;{searchQuery}&rdquo;</strong>
                                </span>
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                                    title="Clear search filter"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.section>

            {/* Filter + Products */}
            <section className="max-w-7xl mx-auto px-10 py-24 flex flex-col lg:flex-row gap-12">
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full lg:w-1/5 shrink-0"
                >
                    <Filter
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryToggle}
                        selectedSize={selectedSize}
                        onSizeChange={(size) => {
                            setSelectedSize(size);
                            setCurrentPage(1);
                        }}
                        priceRange={priceRange}
                        onPriceChange={(price) => {
                            setPriceRange(price);
                            setCurrentPage(1);
                        }}
                        onReset={handleResetFilters}
                    />
                </motion.aside>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1"
                >
                    <ProductGrid
                        products={filteredProducts}
                        currentPage={currentPage}
                        productsPerPage={PRODUCTS_PER_PAGE}
                        loading={loading}
                        sortBy={sortBy}
                        onSortChange={(val) => {
                            setSortBy(val);
                            setCurrentPage(1);
                        }}
                    />

                    {!loading && filteredProducts.length > PRODUCTS_PER_PAGE && (
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredProducts.length}
                            itemsPerPage={PRODUCTS_PER_PAGE}
                            onPageChange={handlePageChange}
                        />
                    )}
                </motion.div>
            </section>
        </main>
    );
}

export default function Shop() {
    return (
        <Suspense fallback={<div className="min-h-screen py-24 text-center text-gray-500">Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}