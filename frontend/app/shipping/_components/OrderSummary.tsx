'use client';

import { motion } from "framer-motion";
import useNavigateTo from "@/hooks/useNavigateTo";

interface CartItem {
    id: string;
    name: string;
    colorSize: string;
    price: number;
    quantity: number;
    image: string;
}

interface OrderSummaryProps {
    items: CartItem[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
    const navigateTo = useNavigateTo();
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[400px] shrink-0"
        >
            <div className="bg-white p-10 sticky top-32 border border-[#e7f1f3] rounded-lg">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-[#e7f1f3]"
                >
                    Order Summary
                </motion.h2>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#4e8b97]">Subtotal</span>
                        <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-[#4e8b97]">Shipping</span>
                        <span className="text-[10px] uppercase tracking-widest">
                            Free
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-[#4e8b97]">Estimated Tax</span>
                        <span className="text-[10px] uppercase tracking-widest">
                            Rs 0.00
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-baseline pt-6 border-t border-[#e7f1f3] mb-10">
                    <span className="text-xs font-bold uppercase tracking-widest">
                        Total
                    </span>
                    <span className="text-2xl font-light tracking-tight">
                        Rs {subtotal.toFixed(2)}
                    </span>
                </div>

                <button
                    onClick={() => navigateTo('/payment')}
                    className="w-full py-5 bg-brand-teal text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1499b5] transition-all flex items-center justify-center gap-3"
                >
                    Continue to Payment
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>

                <div className="mt-8 space-y-4">
                    <p className="text-[10px] text-[#4e8b97] leading-relaxed text-center uppercase tracking-widest">
                        Secure payment &amp; worldwide delivery.
                        <br />
                        Free returns within 30 days.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
