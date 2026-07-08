'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
    id: number
    title: string
    color: string
    price: number
    image: string
}

export default function ProductCard({ id, title, color, price, image }: ProductCardProps) {
    const router = useRouter()

    const handleAddToCart = () => {
        // Add to cart logic here
        console.log(`Added ${title} to cart`)
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
            <div className="relative aspect-[4/5] bg-background-light overflow-hidden mb-4">
                <Image
                    alt={title}
                    src={image}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="hover-actions absolute inset-0 bg-black/5 flex flex-col justify-end p-4 opacity-0 transition-all duration-300 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="w-full py-3 bg-brand-teal text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1499b5] transition-colors"
                        >
                            Add to Cart
                        </button>
                        <button
                            type="button"
                            onClick={handleQuickView}
                            className="w-full py-3 bg-white text-[#0e191b] text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                        >
                            Quick View
                        </button>
                    </div>
                </div>
            </div>
            <div className="text-center space-y-1">
                <h3 className="text-base font-medium tracking-tight">{title}</h3>
                <p className="text-[#4e8b97] text-sm">{color}</p>
                <p className="text-sm font-bold pt-1">Rs {price.toFixed(2)}</p>
            </div>
        </div>
    )
}