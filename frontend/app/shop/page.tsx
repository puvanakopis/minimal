'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Pagination from '@/components/Pagination';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGrid from '@/app/shop/_components/ProductGrid';
import Filter from '@/app/shop/_components/Filter';
import { allProducts } from '@/data/products';

const PRODUCTS_PER_PAGE = 6;

export default function Shop() {
    const [currentPage, setCurrentPage] = useState(1);

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'All Collections', href: '/shop', isActive: true },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                    <h1 className="text-5xl font-serif italic tracking-tight">All Collections</h1>
                </div>
            </motion.section>


            {/* Filter + Products */}
            <section className="max-w-7xl mx-auto px-10 py-24 flex gap-12">
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-1/5 shrink-0 hidden lg:block"
                >
                    <Filter />
                </motion.aside>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1"
                >
                    <ProductGrid
                        products={allProducts}
                        currentPage={currentPage}
                        productsPerPage={PRODUCTS_PER_PAGE}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalItems={allProducts.length}
                        itemsPerPage={PRODUCTS_PER_PAGE}
                        onPageChange={handlePageChange}
                    />
                </motion.div>
            </section>
        </main>
    );
}