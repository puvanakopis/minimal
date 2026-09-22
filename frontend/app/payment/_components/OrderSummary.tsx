'use client';

import { motion } from "framer-motion";
import { useCart, useCheckout } from "@/context";

export function OrderSummary({ isProcessing }: { isProcessing?: boolean }) {
    const { cart } = useCart();
    const { paymentMethod } = useCheckout();
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
                        <span className="font-semibold text-zinc-900">
                            Rs. {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
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

                    <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                        <span className="text-[#4e8b97]">Payment Method</span>
                        <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                            {paymentMethod === 'CARD' ? 'Card Payment' : 'Cash on Delivery'}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-baseline pt-6 border-t border-[#e7f1f3] mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                        Total Amount
                    </span>
                    <span className="text-2xl font-serif font-bold tracking-tight text-zinc-900">
                        Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>

                <button
                    type="submit"
                    form="payment-form"
                    disabled={isProcessing}
                    className="w-full py-4 bg-brand-teal text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1499b5] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all rounded-xl flex items-center justify-center gap-3 cursor-pointer shadow-md"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Placing Order...</span>
                        </>
                    ) : (
                        <>
                            <span>{paymentMethod === 'CARD' ? 'Pay & Place Order' : 'Confirm Order'}</span>
                            <span className="material-symbols-outlined text-base">lock</span>
                        </>
                    )}
                </button>

                <div className="mt-8 space-y-4 text-center">
                    <p className="text-[10px] text-[#4e8b97] leading-relaxed uppercase tracking-widest">
                        Encrypted with 256-bit SSL security.
                        <br />
                        Your order is safe and protected.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
