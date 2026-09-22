'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Pagination from '@/components/Pagination';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/app/men/_components/ProductGrid';
import Filter from '@/app/men/_components/Filter';
import { useProducts } from '@/context';
import { Product } from '@/interfaces';

import { allProducts } from '@/data/products';

const PRODUCTS_PER_PAGE = 6;

export default function MenShop() {
    const { getProducts } = useProducts();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and sort states
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [priceRange, setPriceRange] = useState<number>(100000);

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Men', href: '/men', isActive: true },
    ];

    useEffect(() => {
        let isMounted = true;
        async function fetchMenProducts() {
            setLoading(true);
            try {
                // Fetch products (backend supports gender param or we can fetch and filter men + unisex)
                const response = await getProducts({
                    gender: 'men',
                    sortBy,
                });
                if (isMounted && response.success && response.data && response.data.length > 0) {
                    setProducts(response.data);
                } else if (isMounted) {
                    setProducts(allProducts.filter((p) => p.gender === 'men' || p.gender === 'unisex'));
                }
            } catch (err) {
                console.warn('Failed to fetch men products, using fallback data:', err);
                if (isMounted) {
                    setProducts(allProducts.filter((p) => p.gender === 'men' || p.gender === 'unisex'));
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchMenProducts();
        return () => {
            isMounted = false;
        };
    }, [sortBy]);

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setSelectedCategories([]);
        setSelectedSize('');
        setPriceRange(100000);
        setCurrentPage(1);
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Category
            if (selectedCategories.length > 0) {
                if (!product.category || !selectedCategories.some((cat) => cat.toLowerCase() === product.category?.toLowerCase())) {
                    return false;
                }
            }
            // Size
            if (selectedSize) {
                if (!product.sizes || !product.sizes.includes(selectedSize)) {
                    return false;
                }
            }
            // Price range
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
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </motion.section>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col md:flex-row gap-10">
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-64 shrink-0"
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
            </div>
        </main>
    );
}
