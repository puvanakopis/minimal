'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Story from '@/app/about/_components/Story';

export default function About() {
    return (
        <main className="bg-off-white min-h-screen pb-20">
            <section className="relative w-full h-[60vh] min-h-[480px] md:h-[70vh] bg-[#1a1a1a] overflow-hidden flex items-center">
                <div className="absolute inset-0 z-0">
                    <motion.div
                        initial={{ scale: 1.15, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.65 }}
                        transition={{ duration: 1.8, ease: 'easeOut' }}
                        className="w-full h-full relative"
                    >
                        <Image
                            alt="Minimal design studio Copenhagen"
                            src="/images/about_hero.png"
                            fill
                            priority
                            className="object-cover object-center grayscale-[20%]"
                            sizes="100vw"
                        />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-t from-off-white via-black/1 to-black/30 opacity-50 z-10" />                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-10" />
                </div>

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
                                Est. 2020 / Copenhagen
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-4xl sm:text-6xl lg:text-7xl font-serif leading-[1.1] font-light tracking-tight text-white"
                        >
                            The Art of <br className="hidden sm:inline" />
                            <span className="italic font-normal text-brand-teal">
                                Subtraction
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-white/80 text-base sm:text-lg md:text-xl font-light tracking-wide leading-relaxed max-w-2xl border-l-2 border-brand-teal/40 pl-6 mt-4"
                        >
                            We strip away the noise to uncover the essence of form, material, and movement. A silent dialogue between architecture and anatomy.
                        </motion.p>
                    </div>
                </div>
            </section>

            <div className="relative z-30  max-w-7xl mx-auto px-10 sm:px-6 md:px-10">
                <Story />
            </div>
        </main>
    );
}