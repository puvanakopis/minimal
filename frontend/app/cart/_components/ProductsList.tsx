'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
    id: string;
    name: string;
    colorSize: string;
    price: number;
    quantity: number;
    image: string;
}

interface ProductsListProps {
    items: CartItem[];
}

export function ProductsList({ items }: ProductsListProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>(items);

    const totalItems = cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    const increaseQty = (id: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQty = (id: string) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeItem = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="flex-grow">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-baseline justify-between bg-white text-[#1a1a1a] border border-[#e7f1f3] rounded-lg px-8 py-6 mb-10"
            >
                <h1 className="text-4xl font-serif italic font-medium tracking-tight">
                    Shopping Bag
                </h1>

                <span className="text-xs uppercase tracking-[0.2em] text-[#4e8b97]">
                    ({totalItems} {totalItems === 1 ? "Item" : "Items"})
                </span>
            </motion.div>

            {/* Items */}
            <div className="space-y-12">
                <AnimatePresence mode="popLayout">
                    {cartItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex gap-8 group bg-white text-[#1a1a1a] border border-[#e7f1f3] rounded-lg p-6"
                        >
                            {/* Image */}
                            <div className="w-32 aspect-[4/5] bg-gray-100 overflow-hidden shrink-0 rounded-md">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={128}
                                    height={160}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex flex-col justify-between flex-grow py-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-serif italic mb-1 tracking-tight">
                                            {item.name}
                                        </h3>

                                        <p className="text-xs uppercase tracking-widest text-[#4e8b97] mb-2">
                                            {item.colorSize}
                                        </p>
                                    </div>

                                    <p className="font-medium">
                                        Rs {item.price.toFixed(2)}
                                    </p>
                                </div>

                                {/* Bottom Row */}
                                <div className="flex justify-between items-center">
                                    {/* Quantity Controls (UPDATED STYLE ✨) */}
                                    <div className="flex items-center gap-3">
                                        {/* Decrease */}
                                        <button
                                            onClick={() => decreaseQty(item.id)}
                                            className="size-10 border border-[#e7f1f3] hover:border-brand-teal transition-colors flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined text-base">
                                                remove
                                            </span>
                                        </button>

                                        {/* Quantity */}
                                        <span className="w-10 text-center font-medium">
                                            {item.quantity}
                                        </span>

                                        {/* Increase */}
                                        <button
                                            onClick={() => increaseQty(item.id)}
                                            className="size-10 border border-[#e7f1f3] hover:border-brand-teal transition-colors flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined text-base">
                                                add
                                            </span>
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            delete_outline
                                        </span>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-[#e7f1f3]">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-teal hover:translate-x-[-4px] transition-transform"
                >
                    <span className="material-symbols-outlined text-sm rotate-180">
                        arrow_right_alt
                    </span>

                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}