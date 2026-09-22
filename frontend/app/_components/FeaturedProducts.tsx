'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from '../../components/ProductCard'
import { useProducts } from '@/context'
import { Product } from '@/interfaces'

import { allProducts } from '@/data/products'

export default function FeaturedProducts() {
    const { getProducts } = useProducts()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true
        async function loadFeaturedProducts() {
            try {
                const response = await getProducts()
                if (isMounted && response.success && response.data && response.data.length > 0) {
                    setProducts(response.data.slice(0, 4))
                } else if (isMounted) {
                    setProducts(allProducts.slice(0, 4))
                }
            } catch {
                if (isMounted) {
                    setProducts(allProducts.slice(0, 4))
                }
            } finally {
                if (isMounted) setLoading(false)
            }
        }
        loadFeaturedProducts()
        return () => {
            isMounted = false
        }
    }, [])

    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-10 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-between items-end mb-16"
                >
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-brand-teal uppercase tracking-[0.3em]">Trending Now</h2>
                        <p className="text-4xl font-serif italic">Featured Essentials</p>
                    </div>
                    <Link className="text-sm font-bold border-b-2 border-brand-teal pb-1 hover:text-brand-teal transition-colors uppercase tracking-widest" href="/shop">
                        View All
                    </Link>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="animate-pulse space-y-4">
                                <div className="aspect-[4/5] bg-gray-100 rounded-lg"></div>
                                <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/4 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.15 }}
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
                ) : (
                    <div className="text-center py-12 text-[#4e8b97] italic">
                        No products available at the moment.
                    </div>
                )}
            </div>
        </section>
    )
}