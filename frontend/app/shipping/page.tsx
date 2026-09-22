"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShippingForm } from "./_components/ShippingForm";
import { OrderSummary } from "./_components/OrderSummary";
import { motion } from "framer-motion";
import { useCart } from "@/context";

export default function ShippingPage() {
    const router = useRouter();
    const { cart, isLoading } = useCart();

    useEffect(() => {
        if (!isLoading && cart.items.length === 0) {
            router.replace("/cart");
        }
    }, [isLoading, cart.items.length, router]);

    if (isLoading) {
        return (
            <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20 min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
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
                <ShippingForm />
                <OrderSummary />
            </motion.div>
        </main>
    );
}
