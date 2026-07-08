"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FavoriteProductCard } from "./FavoriteProductCard";
import { allProducts } from "@/data/products";
import { useState } from "react";

export function FavoriteGrid() {
    // Mocking favorites by selecting a few products
    const [favorites, setFavorites] = useState(allProducts.slice(0, 3));

    const handleRemove = (id: number) => {
        setFavorites((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="flex flex-col gap-16">
            {/* Header */}
            <header className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4"
                >
                    <span className="w-8 h-[1px] bg-brand-teal" />
                    <span className="text-[11px] uppercase tracking-[0.4em] text-brand-teal font-bold">
                        Personal Collection
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-5xl md:text-4xl font-serif leading-tight text-zinc-900"
                >
                    My{" "}
                    <span className="italic font-normal text-brand-teal">
                        Favorites
                    </span>
                </motion.h1>
            </header>

            {/* Products List */}
            <AnimatePresence mode="popLayout">
                {favorites.length > 0 ? (
                    <motion.div
                        layout
                        className="flex flex-col gap-5"
                    >
                        {favorites.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                            >
                                <FavoriteProductCard
                                    id={product.id}
                                    title={product.name}
                                    color={product.colors?.[0]?.name || "Original"}
                                    price={product.price}
                                    image={product.image}
                                    onRemove={handleRemove}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-20 text-center"
                    >
                        <span className="material-symbols-outlined text-6xl text-zinc-200 mb-4">
                            favorite
                        </span>
                        <p className="text-zinc-500 font-serif italic">Your favorites list is empty.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
