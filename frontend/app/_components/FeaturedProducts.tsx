'use client'

import { motion } from 'framer-motion'
import ProductCard from '../../components/ProductCard'

const products = [
    {
        id: 1,
        title: 'Structured Wool Overcoat',
        color: 'Camel Taupe',
        price: 450.0,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
    },
    {
        id: 2,
        title: 'Pima Cotton Capsule Tee',
        color: 'Pristine White',
        price: 65.0,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
    },
    {
        id: 3,
        title: 'Raw Selvedge Denim',
        color: 'Indigo Wash',
        price: 185.0,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJdtkthRNwQ0GOEkyVsi9MtMOxr7jk5OcgitCK-fbOEVovDDtu3TXJb2rhV4OUsg0wjfnz7GHc2SyxmIm_TcmFo3FdYoYfMfS0rOW_AFHLERCuR5O-FU6oYRiWFwpckIVrrXN2LdqdJwiuj2royCRAvB4Sqdrs4u7QqpMQH-s74hXPdkWJ_3c5AhwEYV6N2d52qAhw1Nr68hXfKNGeadMQmamYDJsQkNomAobOBh3EkM77ShWMoZvACotu6IjTx485iSycVKQ4-Xh',
    },
    {
        id: 4,
        title: 'Silk Blend Lounge Set',
        color: 'Mist Grey',
        price: 210.0,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G',
    },
]

export default function FeaturedProducts() {
    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-10 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-between items-end mb-16"
                >
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-brand-teal uppercase tracking-[0.3em]">Trending Now</h2>
                        <p className="text-4xl font-serif italic">Featured Essentials</p>
                    </div>
                    <a className="text-sm font-bold border-b-2 border-brand-teal pb-1 hover:text-brand-teal transition-colors uppercase tracking-widest" href="#">View All</a>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.15 }}
                        >
                            <ProductCard {...product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}