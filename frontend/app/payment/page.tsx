"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { OrderSummary } from "./_components/OrderSummary";
import { PaymentForm } from "./_components/PaymentForm";
import { useCart, useCheckout } from "@/context";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "pk_test_placeholder");

export default function PaymentPage() {
    const router = useRouter();
    const { cart, isLoading } = useCart();
    const { isSubmittingOrder } = useCheckout();

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
                <Elements stripe={stripePromise}>
                    <PaymentForm />
                </Elements>
                <OrderSummary isProcessing={isSubmittingOrder} />
            </motion.div>
        </main>
    );
}
