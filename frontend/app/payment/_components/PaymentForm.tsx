'use client';

import { motion } from "framer-motion";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

export function PaymentForm({ onProcessingChange }: { onProcessingChange: (processing: boolean) => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);

    const elementOptions = {
        style: {
            base: {
                fontSize: '18px',
                color: '#1a1a1a',
                fontFamily: 'Cormorant Garamond, serif',
                letterSpacing: '0.025em',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        onProcessingChange(true);
        setError(null);

        const cardNumberElement = elements.getElement(CardNumberElement);

        if (cardNumberElement) {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumberElement,
            });

            if (error) {
                setError(error.message || "An unexpected error occurred");
                onProcessingChange(false);
            } else {
                console.log('[PaymentMethod]', paymentMethod);
                alert("Payment information submitted successfully!");
                onProcessingChange(false);
            }
        }
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
                    Payment Method
                </h1>
                <span className="text-xs uppercase tracking-[0.2em] text-[#4e8b97]">
                    Step 3 of 3
                </span>
            </motion.div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white border border-[#e7f1f3] rounded-lg p-10 space-y-12"
            >
                <form id="payment-form" onSubmit={handleSubmit}>
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-[#e7f1f3]">
                            Credit or Debit Card
                        </h2>

                        <div className="flex flex-col gap-10">
                            {/* Card Number */}
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                    Card Number
                                </label>
                                <div className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 focus-within:border-brand-teal transition-colors duration-300">
                                    <CardNumberElement options={elementOptions} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10">
                                {/* Expiry */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                        Expiry Date
                                    </label>
                                    <div className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 focus-within:border-brand-teal transition-colors duration-300">
                                        <CardExpiryElement options={elementOptions} />
                                    </div>
                                </div>

                                {/* CVC */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                        CVC
                                    </label>
                                    <div className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 focus-within:border-brand-teal transition-colors duration-300">
                                        <CardCvcElement options={elementOptions} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                    Cardholder Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Name on card"
                                    className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm italic font-serif mt-2">
                                    {error}
                                </div>
                            )}
                        </div>
                    </section>
                </form>
            </motion.div>
        </div>
    );
}
