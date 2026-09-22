'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getImageUrl } from '@/helper/image'
import { useFavorites } from '@/context/FavoriteContext'

interface ProductCardProps {
    id: number
    title: string
    category?: string
    price: number
    image: string
}

export default function ProductCard({ id, title, category, price, image }: ProductCardProps) {
    const router = useRouter()
    const { isFavorite, toggleFavorite } = useFavorites()
    const favorited = isFavorite(id)

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation()
        await toggleFavorite({ id, title })
    }

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push(`/products/${id}`)
    }

    return (
        <div
            className="product-card group cursor-pointer"
            onClick={() => router.push(`/products/${id}`)}
        >
            <div className="relative aspect-[4/5] bg-background-light overflow-hidden mb-4 rounded-xl border border-gray-100/60 shadow-2xs">
                <Image
                    alt={title}
                    src={getImageUrl(image)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="hover-actions absolute inset-0 bg-black/10 flex flex-col justify-end p-4 opacity-0 transition-all duration-300 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={handleToggleFavorite}
                            className="w-full py-3 bg-brand-teal text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1499b5] transition-colors rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {favorited ? 'Remove Favorite' : 'Add to Favorites'}
                        </button>
                        <button
                            type="button"
                            onClick={handleQuickView}
                            className="w-full py-3 bg-white text-[#0e191b] text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors rounded-lg shadow-sm cursor-pointer"
                        >
                            Quick View
                        </button>
                    </div>
                </div>
            </div>
            <div className="text-center space-y-1">
                <h3 className="text-base font-medium tracking-tight truncate px-1 text-zinc-900">{title}</h3>
                {category && <p className="text-[#4e8b97] text-xs uppercase tracking-wider font-medium">{category}</p>}
                <p className="text-sm font-bold text-zinc-900 pt-0.5">Rs. {price.toFixed(2)}</p>
            </div>
        </div>
    )
}