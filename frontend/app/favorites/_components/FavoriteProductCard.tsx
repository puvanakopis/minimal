"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface FavoriteProductCardProps {
    id: number;
    title: string;
    color: string;
    price: number;
    image: string;
    onRemove?: (id: number) => void;
}

export function FavoriteProductCard({
    id,
    title,
    color,
    price,
    image,
    onRemove,
}: FavoriteProductCardProps) {
    const router = useRouter();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(`Added ${title} to cart from favorites`);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove?.(id);
    };

    return (
        <motion.div
            layout
            onClick={() => router.push(`/products/${id}`)}
            className="group relative flex items-center gap-6 p-4 md:p-6 bg-white border border-[#e7f1f3] rounded-xl cursor-pointer transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative size-24 md:size-32 overflow-hidden rounded-lg bg-background-light flex-shrink-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-serif text-zinc-900 group-hover:text-brand-teal transition-colors truncate">
                        {title}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-brand-teal/80 font-medium">
                            {color}
                        </span>
                        <span className="text-zinc-300">|</span>
                        <span className="text-sm font-bold text-zinc-900">
                            Rs. {price.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-brand-teal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#1499b5] transition-all rounded shadow-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">shopping_bag</span>
                        Add to Cart
                    </button>

                    <button
                        onClick={handleRemove}
                        className="size-10 flex items-center justify-center border border-zinc-100 text-zinc-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all rounded"
                        title="Remove from favorites"
                    >
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
