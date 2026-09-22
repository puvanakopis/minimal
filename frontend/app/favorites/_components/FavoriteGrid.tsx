"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FavoriteProductCard } from "./FavoriteProductCard";
import { useFavorites } from "@/context/FavoriteContext";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function FavoriteGrid() {
    const { favorites, removeFavorite, isLoading } = useFavorites();

    const handleRemove = (id: number) => {
        removeFavorite(id);
    };

    return (
        <div className="flex flex-col gap-12">
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

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-serif leading-tight text-zinc-900"
                    >
                        My{" "}
                        <span className="italic font-normal text-brand-teal">
                            Favorites
                        </span>
                    </motion.h1>

                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                        {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
            </header>

            {/* Content List */}
            {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
                    <Loader2 className="size-8 animate-spin text-brand-teal" />
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">
                        Loading your favorites...
                    </p>
                </div>
            ) : (
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
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                >
                                    <FavoriteProductCard
                                        id={Number(product.id)}
                                        title={product.name}
                                        category={product.category || "Apparel"}
                                        price={product.price}
                                        image={product.image || product.mainImage || ""}
                                        onRemove={handleRemove}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="py-20 px-6 text-center bg-white border border-[#e7f1f3] rounded-2xl flex flex-col items-center justify-center gap-4"
                        >
                            <span className="material-symbols-outlined text-6xl text-brand-teal/40">
                                favorite_border
                            </span>
                            <div className="space-y-1 max-w-sm">
                                <h3 className="text-xl font-serif text-zinc-900">Your favorites list is empty</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Explore our curated collections and click the heart icon on any product to save it for later.
                                </p>
                            </div>
                            <Link
                                href="/shop"
                                className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1499b5] transition-all rounded-lg shadow-sm"
                            >
                                <span className="material-symbols-outlined text-base">storefront</span>
                                Explore Shop
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
