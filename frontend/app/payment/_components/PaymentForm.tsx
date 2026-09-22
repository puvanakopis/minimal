'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context";
import { notify } from "@/helper/toast";

export function PaymentForm() {
    const router = useRouter();
    const { paymentMethod, setPaymentMethod, completeOrder, isSubmittingOrder, shippingDetails } = useCheckout();

    const [cardHolder, setCardHolder] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");

    const handleFormatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.replace(/(\d{4})/g, '$1 ').trim();
        setCardNumber(val);
    };

    const handleFormatExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) {
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        setExpiry(val);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (paymentMethod === 'CARD') {
            if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
                notify.warning("Please enter a valid card number");
                return;
            }
            if (!cardHolder.trim()) {
                notify.warning("Please enter cardholder name");
                return;
            }
            if (!expiry || expiry.length < 4) {
                notify.warning("Please enter expiry date MM/YY");
                return;
            }
            if (!cvc || cvc.length < 3) {
                notify.warning("Please enter 3 or 4 digit CVC");
                return;
            }
        }

        const order = await completeOrder(paymentMethod === 'CARD' ? 'PAID' : 'PENDING');
        if (order) {
            router.push('/orders');
        }
    };

    return (
        <div className="flex-grow">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-baseline justify-between bg-white text-[#1a1a1a] border border-[#e7f1f3] rounded-2xl px-8 py-6 mb-8 shadow-2xs"
            >
                <h1 className="text-4xl font-serif italic font-medium tracking-tight">
                    Payment Method
                </h1>
                <span className="text-xs uppercase tracking-[0.2em] text-[#4e8b97] font-semibold">
                    Step 3 of 3
                </span>
            </motion.div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white border border-[#e7f1f3] rounded-2xl p-8 md:p-10 space-y-10 shadow-2xs"
            >
                <form id="payment-form" onSubmit={handleSubmit}>
                    {/* Delivery summary badge */}
                    <div className="mb-8 p-4 bg-[#f6f8f8] border border-[#e7f1f3] rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-brand-teal">local_shipping</span>
                            <span className="text-gray-700">
                                Shipping to: <strong>{shippingDetails.fullName || 'Customer'}</strong> ({shippingDetails.city || 'Colombo'})
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.push('/shipping')}
                            className="text-brand-teal font-bold hover:underline uppercase tracking-wider text-[10px]"
                        >
                            Change
                        </button>
                    </div>

                    {/* Payment Method Selector Tabs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('CARD')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                paymentMethod === 'CARD'
                                    ? 'border-brand-teal bg-[#e7f1f3]/30 shadow-xs'
                                    : 'border-gray-200 hover:border-brand-teal/40'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-xl ${paymentMethod === 'CARD' ? 'text-brand-teal' : 'text-gray-400'}`}>
                                credit_card
                            </span>
                            <div>
                                <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Credit or Debit Card</p>
                                <p className="text-[11px] text-[#4e8b97] mt-0.5">Visa, Mastercard, Amex</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                                paymentMethod === 'CASH_ON_DELIVERY'
                                    ? 'border-brand-teal bg-[#e7f1f3]/30 shadow-xs'
                                    : 'border-gray-200 hover:border-brand-teal/40'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-xl ${paymentMethod === 'CASH_ON_DELIVERY' ? 'text-brand-teal' : 'text-gray-400'}`}>
                                payments
                            </span>
                            <div>
                                <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Cash on Delivery</p>
                                <p className="text-[11px] text-[#4e8b97] mt-0.5">Pay in cash upon doorstep delivery</p>
                            </div>
                        </button>
                    </div>

                    {/* Card fields */}
                    {paymentMethod === 'CARD' && (
                        <div className="space-y-6 pt-2">
                            {/* Card Number */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                    Card Number <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="4000 1234 5678 9010"
                                    value={cardNumber}
                                    onChange={handleFormatCardNumber}
                                    maxLength={19}
                                    className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Expiry */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                        Expiry Date <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="MM / YY"
                                        value={expiry}
                                        onChange={handleFormatExpiry}
                                        maxLength={5}
                                        className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                                    />
                                </div>

                                {/* CVC */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                        CVC <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="123"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                                        maxLength={4}
                                        className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                                    />
                                </div>
                            </div>

                            {/* Cardholder Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                    Cardholder Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Name on card"
                                    value={cardHolder}
                                    onChange={(e) => setCardHolder(e.target.value)}
                                    className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                                />
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'CASH_ON_DELIVERY' && (
                        <div className="p-6 bg-[#f6f8f8] border border-[#e7f1f3] rounded-xl space-y-3">
                            <div className="flex items-center gap-2 text-brand-teal font-bold text-xs uppercase tracking-wider">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                <span>Doorstep Cash on Delivery Available</span>
                            </div>
                            <p className="text-xs text-[#4e8b97] leading-relaxed">
                                You will pay in cash to the courier representative when your parcel is delivered to your designated address in Sri Lanka.
                            </p>
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
