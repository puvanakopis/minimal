'use client';

import { motion } from "framer-motion";

export function ShippingForm() {
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
                    Shipping Details
                </h1>
                <span className="text-xs uppercase tracking-[0.2em] text-[#4e8b97]">
                    Step 2 of 3
                </span>
            </motion.div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white border border-[#e7f1f3] rounded-lg p-10 space-y-12"
            >

                {/* Contact Information */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-[#e7f1f3]">
                        Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

                        {/* Email */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300"
                            />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="+94 7X XXX XXXX"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300"
                            />
                        </div>
                    </div>
                </section>

                {/* Shipping Address */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-[#e7f1f3]">
                        Shipping Address (Sri Lanka)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

                        {/* Full Name */}
                        <div className="md:col-span-2 flex flex-col gap-3">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Your Full Name"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300"
                            />
                        </div>

                        {/* Street Address */}
                        <div className="md:col-span-2 flex flex-col gap-3">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Street Address
                            </label>
                            <input
                                type="text"
                                placeholder="No. 123, Main Street"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300"
                            />
                        </div>

                        {/* City */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                City
                            </label>
                            <input
                                type="text"
                                placeholder="Colombo / Kandy / Galle"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300"
                            />
                        </div>

                        {/* District */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                District
                            </label>
                            <input
                                type="text"
                                placeholder="Colombo District"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300"
                            />
                        </div>

                        {/* Postal Code */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                placeholder="10XXX"
                                className="bg-transparent border-0 border-b border-[#e7f1f3] py-3 font-serif text-lg focus:border-brand-teal outline-none transition-colors duration-300"
                            />
                        </div>

                        {/* Country */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] uppercase tracking-widest text-[#4e8b97] font-bold">
                                Country
                            </label>
                            <input
                                type="text"
                                value="Sri Lanka"
                                disabled
                                className="bg-gray-50 border-0 border-b border-[#e7f1f3] py-3 font-serif text-lg text-gray-500"
                            />
                        </div>
                    </div>
                </section>
            </motion.div>
        </div>
    );
}