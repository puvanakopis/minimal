'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Pagination from '@/components/Pagination';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/app/women/_components/ProductGrid';
import Filter from '@/app/women/_components/Filter';
import { productService } from '@/services';
import { Product } from '@/interfaces';

const PRODUCTS_PER_PAGE = 6;

export default function WomenShop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and sort states
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [priceRange, setPriceRange] = useState<number>(1000);

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Women', href: '/women', isActive: true },
    ];

    useEffect(() => {
        let isMounted = true;
        async function fetchWomenProducts() {
            setLoading(true);
            try {
                const response = await productService.getProducts({
                    gender: 'women',
                    sortBy,
                });
                if (isMounted && response.success && response.data) {
                    setProducts(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch women products:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchWomenProducts();
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
        setSelectedColor('');
        setPriceRange(1000);
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
            // Color
            if (selectedColor) {
                if (!product.colors || !product.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))) {
                    return false;
                }
            }
            // Price range
            if (product.price > priceRange) {
                return false;
            }
            return true;
        });
    }, [products, selectedCategories, selectedSize, selectedColor, priceRange]);

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
                    <h1 className="text-5xl font-serif italic tracking-tight">Women</h1>
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
                        selectedColor={selectedColor}
                        onColorChange={(color) => {
                            setSelectedColor(color);
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
