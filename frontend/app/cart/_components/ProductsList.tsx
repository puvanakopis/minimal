'use client';

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context";
import { getImageUrl } from "@/helper/image";

export function ProductsList() {
    const { cart, updateQuantity, removeFromCart } = useCart();
    const cartItems = cart.items;
    const totalItems = cart.totalItems;

    return (
        <div className="flex-grow">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-baseline justify-between bg-white text-[#1a1a1a] border border-[#e7f1f3] rounded-lg px-8 py-6 mb-10 shadow-2xs"
            >
                <h1 className="text-4xl font-serif italic font-medium tracking-tight">
                    Shopping Bag
                </h1>

                <span className="text-xs uppercase tracking-[0.2em] text-[#4e8b97] font-semibold">
                    ({totalItems} {totalItems === 1 ? "Item" : "Items"})
                </span>
            </motion.div>

            {/* Items */}
            <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {cartItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="flex flex-col sm:flex-row gap-6 group bg-white text-[#1a1a1a] border border-[#e7f1f3] rounded-lg p-6 shadow-2xs hover:border-brand-teal/30 transition-all"
                        >
                            {/* Image */}
                            <div className="relative w-full sm:w-28 sm:h-36 aspect-[4/5] bg-gray-100 overflow-hidden shrink-0 rounded-md">
                                <Image
                                    src={getImageUrl(item.image)}
                                    alt={item.name}
                                    fill
                                    sizes="120px"
                                    unoptimized
                                    className="object-cover transition-all duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex flex-col justify-between flex-grow py-1 gap-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <Link href={`/products/${item.productId}`} className="hover:text-brand-teal transition-colors">
                                            <h3 className="text-lg font-serif italic mb-1 tracking-tight font-medium">
                                                {item.name}
                                            </h3>
                                        </Link>

                                        {(item.size || item.colorSize) && (
                                            <p className="text-xs uppercase tracking-widest text-[#4e8b97] mb-2 font-semibold">
                                                Size {item.size || item.colorSize?.replace(/^Size\s*/i, '')}
                                            </p>
                                        )}
                                    </div>

                                    <p className="font-semibold text-zinc-900 shrink-0 text-base">
                                        Rs. {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>

                                {/* Bottom Row */}
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100/70">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        {/* Decrease */}
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="size-8 rounded-lg border border-[#e7f1f3] hover:border-brand-teal hover:bg-[#e7f1f3]/40 transition-colors flex items-center justify-center cursor-pointer text-gray-700"
                                            title="Decrease quantity"
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                remove
                                            </span>
                                        </button>

                                        {/* Quantity */}
                                        <span className="w-8 text-center font-medium text-xs">
                                            {item.quantity}
                                        </span>

                                        {/* Increase */}
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="size-8 rounded-lg border border-[#e7f1f3] hover:border-brand-teal hover:bg-[#e7f1f3]/40 transition-colors flex items-center justify-center cursor-pointer text-gray-700"
                                            title="Increase quantity"
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                add
                                            </span>
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        type="button"
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
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
            <div className="mt-12 pt-6 border-t border-[#e7f1f3]">
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