'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function JournalSection() {
    return (
        <section className="max-w-7xl mx-auto px-10 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="aspect-square bg-gray-100 overflow-hidden relative"
                >
                    <Image
                        alt="The Minimal Journal"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQeDRtvXAYNLhe4WerX6gPWP3hZNaGzbCyQhDWpvewQT5NBdBQSgbTa-DfvrBu2VaHeyskcA9zzKhMrIn6QX6QyfJnVRf74pIiklGwnktxjGF-26imYY-7GkxB8zza86QMKg_VdNEgXYdb67ZIeJk6gvwjPA6mNnknK29vbOg1SLhKkmUEIDMhKp-7s67R5BJx5DtAnjjpWmvk9TaDe0jBrnviWTNMbD4m4capzhwFK40fMSl9Z93LwObV1D6o1SKioAHzZlC24Wzm"
                        fill
                        className="object-cover"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-8"
                >
                    <h2 className="text-sm font-bold text-brand-teal uppercase tracking-[0.3em]">The Journal</h2>
                    <p className="text-5xl font-serif italic leading-tight">The Philosophy of Quiet Luxury</p>
                    <p className="text-[#4e8b97] text-lg leading-relaxed">
                        Discover the stories behind our sustainable practices and the craftsmen who bring our minimalist visions to life. From fabric sourcing to timeless design, explore our journey.
                    </p>
                    <button className="px-10 py-4 border border-[#0e191b] text-[#0e191b] text-xs font-bold uppercase tracking-widest hover:bg-[#0e191b] hover:text-white transition-all">
                        Read the Journal
                    </button>
                </motion.div>
            </div>
        </section>
    )
}