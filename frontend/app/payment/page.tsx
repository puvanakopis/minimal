"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { OrderSummary } from "./_components/OrderSummary";
import { PaymentForm } from "./_components/PaymentForm";

// Replace with your actual publishable key
const stripePromise = loadStripe("pk_test_placeholder");

export default function PaymentPage() {
    const [isProcessing, setIsProcessing] = useState(false);

    // This would typically come from a cart context or state management
    const cartItems = [
        {
            id: "1",
            name: "Structured Wool Overcoat",
            colorSize: "Camel Taupe / Size S",
            price: 450.0,
            quantity: 1,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE",
        },
        {
            id: "2",
            name: "Signature Cashmere Knit",
            colorSize: "Midnight Navy / Size M",
            price: 295.0,
            quantity: 1,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE",
        },
    ];

    return (
        <main className="max-w-7xl mx-auto px-10 pt-10 pb-20 overflow-hidden min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col lg:flex-row gap-20"
            >
                <Elements stripe={stripePromise}>
                    <PaymentForm onProcessingChange={setIsProcessing} />
                </Elements>
                <OrderSummary items={cartItems} isProcessing={isProcessing} />
            </motion.div>
        </main>
    );
}
