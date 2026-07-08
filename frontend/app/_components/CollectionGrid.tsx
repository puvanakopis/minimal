'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const collections = [
  {
    title: 'Women',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQeDRtvXAYNLhe4WerX6gPWP3hZNaGzbCyQhDWpvewQT5NBdBQSgbTa-DfvrBu2VaHeyskcA9zzKhMrIn6QX6QyfJnVRf74pIiklGwnktxjGF-26imYY-7GkxB8zza86QMKg_VdNEgXYdb67ZIeJk6gvwjPA6mNnknK29vbOg1SLhKkmUEIDMhKp-7s67R5BJx5DtAnjjpWmvk9TaDe0jBrnviWTNMbD4m4capzhwFK40fMSl9Z93LwObV1D6o1SKioAHzZlC24Wzm',
    href: '/women',
  },
  {
    title: 'Men',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
    href: '/men',
  },
  {
    title: 'Accessories',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHvE4FEl8h_DcqRrK3vJz7oYRI-egOV2QBKZcY0mml4HS8QXQ__kzxwsPbz0CK22wsfVAQmBOJgnciNH9fPbSDl7vlH4ImCuDXCgeJzOhQflcSMbi1is8_Zz2-Rz4UZuORTFI9eIkPmt4y1BZiXH2cwGMeajc69X1O4awnfqAHJ-UlU0yYYFnSx79RkEdGnKHVVcRnMgtZrAW_dCQdMmA3MGHFABu5-NlOlZFC3hjj8wHmT56TDmogCcPWmiooKyGy6-awHdad1Yar',
    href: '/shop',
  },
]

export default function CollectionGrid() {
  return (
    <section className="max-w-7xl mx-auto px-10 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center mb-16 space-y-4"
      >
        <h2 className="text-sm font-bold text-brand-teal uppercase tracking-[0.3em]">Signature Lines</h2>
        <p className="text-4xl font-serif italic text-center">Curated Collections</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
          >
            <Link
              href={collection.href}
              className="group relative block aspect-[3/4] overflow-hidden cursor-pointer"
            >
              <Image
                alt={`${collection.title}'s Collection`}
                src={collection.image}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-500"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h3 className="text-3xl font-serif italic mb-2">{collection.title}</h3>
                <p className="text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">Explore Pieces</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}