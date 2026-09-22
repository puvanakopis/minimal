"use client";

import { ProductsList } from "./_components/ProductsList";
import { OrderSummary } from "./_components/OrderSummary";
import { motion } from "framer-motion";
import { useCart } from "@/context";
import Link from "next/link";

export default function CartPage() {
    const { cart, isLoading } = useCart();

    if (isLoading) {
        return (
            <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20 min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs uppercase tracking-widest text-[#4e8b97] font-semibold">Loading shopping bag...</p>
                </div>
            </main>
        );
    }

    if (cart.items.length === 0) {
        return (
            <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24 min-h-[70vh] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-md mx-auto space-y-6"
                >
                    <div className="size-20 rounded-full bg-[#f6f8f8] border border-[#e7f1f3] flex items-center justify-center mx-auto text-brand-teal">
                        <span className="material-symbols-outlined text-4xl">shopping_bag</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-serif italic text-zinc-900">Your Shopping Bag is Empty</h1>
                        <p className="text-xs text-[#4e8b97] leading-relaxed uppercase tracking-wider">
                            Explore our timeless minimalist collections and discover essential pieces crafted with premium fibers.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-8 py-4 bg-brand-teal hover:bg-[#1499b5] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-md gap-3"
                        >
                            <span>Explore Shop</span>
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </Link>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-20 overflow-hidden min-h-[75vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col lg:flex-row gap-12 lg:gap-20"
            >
                <ProductsList />
                <OrderSummary />
            </motion.div>
        </main>
    );
}