"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

const Hero = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { y: "100%", opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            },
        },
    };

    return (
        <>
            <section className="relative w-full h-screen max-h-screen overflow-hidden bg-[#0d0d0d] text-white">

                {/* Background Image */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <motion.div
                        initial={{ scale: 1.08, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.8 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src="/images/home_hero.png"
                            alt="home"
                            fill
                            priority
                            className="object-cover object-center"
                            sizes="100vw"
                        />
                    </motion.div>

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/30 to-black/60 z-10" />
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] z-10" />
                </div>

                {/* Main Layout */}
                <div className="relative z-20 h-full flex flex-col justify-between max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">

                    {/* Top HUD */}
                    <div className="hidden sm:flex items-center justify-between pt-6 text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-[1px] bg-brand-teal animate-pulse" />
                            <span>LOC // CPH [ 55.6761° N, 12.5683° E ]</span>
                        </div>

                        <span>EDITION 04 / AUTUMN WINTER</span>
                    </div>

                    {/* Hero Content */}
                    <div className="flex-1 flex items-center justify-center text-center py-10">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="max-w-4xl space-y-5 md:space-y-6"
                        >

                            {/* Collection Tag */}
                            <div className="overflow-hidden inline-block">
                                <motion.div
                                    variants={itemVariants}
                                    className="flex items-center justify-center gap-3 text-brand-teal text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-semibold"
                                >
                                    <span className="w-6 h-[1px] bg-brand-teal" />
                                    <span>A Study in Subtraction</span>
                                    <span className="w-6 h-[1px] bg-brand-teal" />
                                </motion.div>
                            </div>

                            {/* Heading */}
                            <h1 className="leading-[0.95] tracking-tight font-serif font-light select-none">
                                <div className="overflow-hidden">
                                    <motion.span
                                        variants={itemVariants}
className="block text-[2.2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[6rem] xl:text-[7rem] text-white/95"                                    >
                                        THE POETRY OF
                                    </motion.span>
                                </div>

                                <div className="overflow-hidden">
                                    <motion.span
                                        variants={itemVariants}
                                        className="block italic text-brand-teal text-[3rem] sm:text-[5rem] md:text-[6rem] lg:text-[8rem] xl:text-[9rem]"
                                    >
                                        SILENCE
                                    </motion.span>
                                </div>
                            </h1>

                            {/* Description */}
                            <div className="overflow-hidden max-w-2xl mx-auto">
                                <motion.p
                                    variants={itemVariants}
                                    className="text-white/70 text-sm sm:text-base md:text-lg font-light tracking-wide leading-relaxed px-2"
                                >
                                    Every seam is tailored to adapt to the posture
                                    of the wearer. No details demanded, simply
                                    quiet essentials crafted from organic fibers.
                                </motion.p>
                            </div>

                            {/* CTA */}
                            <motion.div
                                variants={itemVariants}
                                className="pt-4 flex justify-center"
                            >
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/20 px-6 sm:px-8 py-3 sm:py-4 rounded-full backdrop-blur-md cursor-pointer transition-all duration-300 shadow-xl shadow-black/10 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold"
                                >
                                    <span className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                        <Play className="size-3.5 fill-current ml-0.5" />
                                    </span>

                                    <span>Launch Cinematic Lookbook</span>
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Bottom Space */}
                    <div className="pb-6" />
                </div>
            </section>

            {/* Video Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                    >

                        {/* Close */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 z-[60]"
                        >
                            <X className="size-5" />
                        </motion.button>

                        {/* Video */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 30 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 18,
                            }}
                            className="relative w-full max-w-[1280px] aspect-video bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1&controls=0&loop=1&playlist=5qap5aO4i9A"
                                title="Editorial Campaign Film"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />

                            {/* HUD */}
                            <div className="hidden sm:flex absolute inset-x-0 top-0 p-6 justify-between text-white/50 text-[10px] font-mono tracking-widest pointer-events-none">
                                <span>SYSTEM MODE: AW24_CAMPAIGN</span>
                                <span>COPENHAGEN, DK</span>
                            </div>

                            <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-6 justify-between text-white/50 text-[10px] font-mono tracking-widest pointer-events-none">
                                <span>PLAYBACK / 1080P</span>
                                <span>MINIMAL APPAREL CO.</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Hero;