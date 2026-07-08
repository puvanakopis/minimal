'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, HelpCircle, ArrowUpRight } from 'lucide-react';
import ContactForm from '@/app/contact/_components/ContactForm';

export default function Contact() {
    return (
        <main className="bg-off-white min-h-screen pb-20">
            {/* Immersive Contact Hero Header */}
            <section className="relative w-full h-[60vh] min-h-[480px] md:h-[70vh] bg-[#1a1a1a] overflow-hidden flex items-center">
                {/* Background Image with Zoom Motion */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        initial={{ scale: 1.15, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.65 }}
                        transition={{ duration: 1.8, ease: 'easeOut' }}
                        className="w-full h-full relative"
                    >
                        <Image
                            alt="Minimal creative showroom Copenhagen"
                            src="/images/contact_hero.png"
                            fill
                            priority
                            className="object-cover object-center grayscale-[10%]"
                            sizes="100vw"
                        />
                    </motion.div>
                    
                    {/* Vignette Overlay matching About page */}
                    <div className="absolute inset-0 bg-gradient-to-t from-off-white via-black/1 to-black/30 opacity-50 z-10" />
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-10" />
                </div>

                {/* Hero Title & Caption Content */}
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-20 text-white mt-12 md:mt-20">
                    <div className="max-w-3xl space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <span className="w-8 h-[1px] bg-brand-teal" />
                            <span className="text-[11px] uppercase tracking-[0.4em] text-brand-teal font-bold">
                                Support & Concierge
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-4xl sm:text-6xl lg:text-7xl font-serif leading-[1.1] font-light tracking-tight text-white"
                        >
                            How can we <br className="hidden sm:inline" />
                            <span className="italic font-normal text-brand-teal">help</span> you?
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-white/80 text-base sm:text-lg md:text-xl font-light tracking-wide leading-relaxed max-w-2xl border-l-2 border-brand-teal/40 pl-6 mt-4"
                        >
                            Whether you need assistance with an order, size guidance, or have a general inquiry, our team is dedicated to providing swift resolution.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Split Content Layout */}
            <div className="relative z-30 max-w-7xl mx-auto px-10 sm:px-6 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start pt-16">
                    
                    {/* Left Column: Details & Office */}
                    <div className="lg:col-span-5 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4"
                        >
                            <span className="text-xs font-bold text-brand-teal uppercase tracking-[0.3em] block">
                                Contact Information
                            </span>
                            <h2 className="text-3xl font-serif italic text-soft-charcoal">
                                We are here to connect.
                            </h2>
                            <p className="text-sm text-[#4e8b97] font-light leading-relaxed">
                                Reach out directly through the specified channels, or fill out the form and our specialized support team will register your issue.
                            </p>
                        </motion.div>

                        {/* Interactive contact details list */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-6 bg-white border border-[#e7f1f3] p-8 rounded-xl"
                        >
                            {/* HQ Address */}
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-[#f8f8f7] rounded-full text-brand-teal">
                                    <MapPin className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs uppercase tracking-wider font-bold text-soft-charcoal">
                                        Minimal Copenhagen HQ
                                    </h4>
                                    <p className="text-sm text-[#4e8b97] font-light leading-relaxed">
                                        Nørregade 14, 1165<br />
                                        Copenhagen, Denmark
                                    </p>
                                </div>
                            </div>

                            {/* Direct Line */}
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-[#f8f8f7] rounded-full text-brand-teal">
                                    <Phone className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs uppercase tracking-wider font-bold text-soft-charcoal">
                                        Concierge Hotline
                                    </h4>
                                    <p className="text-sm text-[#4e8b97] font-light hover:text-brand-teal transition-colors">
                                        <a href="tel:+4533123456">+45 33 12 34 56</a>
                                    </p>
                                </div>
                            </div>

                            {/* Direct Email */}
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-[#f8f8f7] rounded-full text-brand-teal">
                                    <Mail className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs uppercase tracking-wider font-bold text-soft-charcoal">
                                        General Email
                                    </h4>
                                    <p className="text-sm text-[#4e8b97] font-light hover:text-brand-teal transition-colors">
                                        <a href="mailto:support@minimal.com">support@minimal.com</a>
                                    </p>
                                </div>
                            </div>

                            {/* Atelier Hours */}
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-[#f8f8f7] rounded-full text-brand-teal">
                                    <Clock className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs uppercase tracking-wider font-bold text-soft-charcoal">
                                        Operating Hours
                                    </h4>
                                    <p className="text-sm text-[#4e8b97] font-light leading-relaxed">
                                        Mon – Fri: 09:00 – 17:00 CET<br />
                                        Sat: 10:00 – 14:00 CET<br />
                                        Sun: Closed
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* FAQs redirection box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-brand-teal/5 border border-brand-teal/15 p-6 rounded-xl flex items-start gap-4"
                        >
                            <div className="p-2.5 bg-brand-teal/10 rounded-full text-brand-teal">
                                <HelpCircle className="size-5" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-soft-charcoal">
                                    Looking for immediate answers?
                                </h4>
                                <p className="text-xs text-[#4e8b97] font-light leading-relaxed">
                                    Find instant answers regarding shipping rates, sizing tables, return policy, and refunds in our comprehensive help section.
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-teal hover:underline pt-1"
                                >
                                    Visit Help Center
                                    <ArrowUpRight className="size-3" />
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-7 ">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
