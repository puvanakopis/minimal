'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Compass, Eye } from 'lucide-react';

const stats = [
    { value: '2020', label: 'Est. In Copenhagen' },
    { value: '100%', label: 'Traceable Fibers' },
    { value: '12', label: 'Artisanal Mills' },
    { value: '100k+', label: 'Happy Customers' },
];

const values = [
    {
        icon: Compass,
        title: 'Absolute Simplicity',
        description:
            'We believe that subtraction is addition. Every line, seam, and detail serves a definitive purpose in shape and comfort.',
    },
    {
        icon: ShieldCheck,
        title: 'Material Integrity',
        description:
            'Sourcing organic wool, pure mulled silk, and long-staple cotton from mills dedicated to carbon-neutral production.',
    },
    {
        icon: Eye,
        title: 'Radical Transparency',
        description:
            'Tracing each garment from raw fiber to final stitch, fostering a honest dialogue with our global community.',
    },
];

export default function Story() {
    return (
        <div className="space-y-24">
            {/* Split Story Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                <div className="lg:col-span-6 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4"
                    >
                        <span className="text-xs font-bold text-brand-teal uppercase tracking-[0.3em] block">
                            Our Origin
                        </span>
                        <h2 className="text-4xl font-serif italic tracking-tight">
                            A dialogue between design and purpose.
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6 text-gray-400 font-light leading-relaxed text-sm md:text-base"
                    >
                        <p>
                            Minimal was born out of a desire to bypass the relentless cycle of fast-fashion and focus on what truly matters: materiality, anatomy, and longevity. We began in a small atelier in Copenhagen, experimenting with raw construction techniques and unrefined natural textiles.
                        </p>
                        <p>
                            Today, we create quiet essentials. Garments that do not demand attention, but rather adapt to the rhythm of the wearer. Every piece is an exploration of form, tailored to fit the modern posture while allowing complete freedom of movement.
                        </p>
                    </motion.div>
                </div>

                {/* Images (STATIC) */}
                <div className="lg:col-span-6 flex justify-center items-center py-10">
                    <div className="relative w-full max-w-[420px] aspect-[4/5]">

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="absolute left-0 top-0 w-[75%] aspect-[3/4] border border-white/20 shadow-2xl overflow-hidden"
                        >
                            <Image
                                alt="Atelier detail"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 40, y: 40, rotate: 2 }}
                            whileInView={{ opacity: 1, scale: 1, x: 40, y: 40, rotate: 2 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="absolute right-0 bottom-0 w-[65%] aspect-[3/4] border border-white/40 shadow-2xl overflow-hidden z-10"
                        >
                            <Image
                                alt="Fabric cutting"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="bg-white  border border-[#e7f1f3] py-16 px-8 rounded-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-[1200px] mx-auto">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="space-y-2"
                        >
                            <h3 className="text-4xl md:text-5xl font-serif italic text-brand-teal">
                                {stat.value}
                            </h3>
                            <p className="text-xs uppercase  font-semibold">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Core Values Section */}
            <div className="space-y-16">
                <div className="text-center max-w-xl mx-auto space-y-4">
                    <span className="text-xs font-bold text-brand-teal uppercase tracking-[0.3em] block">
                        Our Pillars
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif italic">
                        Values that form us
                    </h2>
                    <p className="text-sm text-[#4e8b97] font-light">
                        Every collection is defined by three unyielding standards of conscious creation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {values.map((val) => {
                        const IconComponent = val.icon;

                        return (
                            <motion.div
                                key={val.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="p-8 bg-white border border-[#e7f1f3] flex flex-col items-center text-center space-y-5 rounded-lg"
                            >
                                <div className="p-4 rounded-full bg-brand-teal/10 text-brand-teal">
                                    <IconComponent className="size-6" />
                                </div>

                                <h3 className="text-xl font-serif italic text-soft-charcoal text-black">
                                    {val.title}
                                </h3>

                                <p className="text-sm font-light leading-relaxed text-black/50">
                                    {val.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}