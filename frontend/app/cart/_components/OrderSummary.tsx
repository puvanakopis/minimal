'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context";

export function OrderSummary() {
    const { cart } = useCart();
    const { subtotal, shippingCost, total } = cart;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[380px] shrink-0"
        >
            <div className="bg-white p-8 lg:p-10 sticky top-28 border border-[#e7f1f3] rounded-2xl shadow-2xs">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-[#e7f1f3] text-zinc-900"
                >
                    Order Summary
                </motion.h2>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#4e8b97]">Subtotal</span>
                        <span className="font-semibold text-zinc-900">Rs. {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-[#4e8b97]">Shipping</span>
                        <span className="text-xs font-semibold text-zinc-900">
                            {shippingCost === 0 ? (
                                <span className="text-emerald-600 font-bold uppercase tracking-wider">Free</span>
                            ) : (
                                `Rs. ${shippingCost.toFixed(2)}`
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-[#4e8b97]">Estimated Tax</span>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                            Included
                        </span>
                    </div>

                    {subtotal > 0 && subtotal < 25000 && (
                        <p className="text-[11px] text-brand-teal/90 bg-[#e7f1f3]/50 p-2.5 rounded-lg">
                            Add <strong>Rs. {(25000 - subtotal).toLocaleString()}</strong> more to qualify for <strong>FREE shipping</strong>!
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-baseline pt-6 border-t border-[#e7f1f3] mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                        Total
                    </span>
                    <span className="text-2xl font-serif font-bold tracking-tight text-zinc-900">
                        Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>

                <Link
                    href="/shipping"
                    className="w-full py-4 bg-brand-teal text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1499b5] transition-all rounded-xl flex items-center justify-center gap-3 shadow-md"
                >
                    <span>Proceed to Checkout</span>
                    <span className="material-symbols-outlined text-base">lock</span>
                </Link>

                <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[11px] text-[#4e8b97]">
                        <span className="material-symbols-outlined text-sm text-brand-teal">verified_user</span>
                        <span>Secure SSL encrypted checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#4e8b97]">
                        <span className="material-symbols-outlined text-sm text-brand-teal">local_shipping</span>
                        <span>Island-wide 3-5 day delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#4e8b97]">
                        <span className="material-symbols-outlined text-sm text-brand-teal">replay</span>
                        <span>30-day hassle-free return policy</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}