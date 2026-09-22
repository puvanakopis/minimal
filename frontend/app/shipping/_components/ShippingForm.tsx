'use client';

import { motion } from "framer-motion";
import { useCheckout } from "@/context";

export function ShippingForm() {
    const { shippingDetails, updateShippingField } = useCheckout();

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
                    Shipping Details
                </h1>
                <span className="text-xs uppercase tracking-[0.2em] text-[#4e8b97] font-semibold">
                    Step 2 of 3
                </span>
            </motion.div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white border border-[#e7f1f3] rounded-2xl p-8 md:p-10 space-y-12 shadow-2xs"
            >
                {/* Contact Information */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-[#e7f1f3] text-zinc-900">
                        Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Email Address <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={shippingDetails.email}
                                onChange={(e) => updateShippingField('email', e.target.value)}
                                placeholder="name@example.com"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                            />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Phone Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                value={shippingDetails.phone}
                                onChange={(e) => updateShippingField('phone', e.target.value)}
                                placeholder="+94 7X XXX XXXX"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                            />
                        </div>
                    </div>
                </section>

                {/* Shipping Address */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-[#e7f1f3] text-zinc-900">
                        Shipping Address (Sri Lanka)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {/* Full Name */}
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={shippingDetails.fullName}
                                onChange={(e) => updateShippingField('fullName', e.target.value)}
                                placeholder="Your Full Name"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                            />
                        </div>

                        {/* Street Address */}
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Street Address <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={shippingDetails.streetAddress}
                                onChange={(e) => updateShippingField('streetAddress', e.target.value)}
                                placeholder="No. 123, Main Street"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                            />
                        </div>

                        {/* City */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                City <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={shippingDetails.city}
                                onChange={(e) => updateShippingField('city', e.target.value)}
                                placeholder="Colombo / Kandy / Galle"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                            />
                        </div>

                        {/* District */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                District
                            </label>
                            <input
                                type="text"
                                value={shippingDetails.district || ''}
                                onChange={(e) => updateShippingField('district', e.target.value)}
                                placeholder="Colombo District"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                            />
                        </div>

                        {/* Postal Code */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                value={shippingDetails.postalCode || ''}
                                onChange={(e) => updateShippingField('postalCode', e.target.value)}
                                placeholder="00100"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300 text-zinc-900"
                            />
                        </div>

                        {/* Country */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Country
                            </label>
                            <input
                                type="text"
                                value={shippingDetails.country || 'Sri Lanka'}
                                disabled
                                className="bg-gray-50 border-0 border-b border-[#e7f1f3] py-2.5 font-serif text-lg text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </section>
            </motion.div>
        </div>
    );
}