"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getImageUrl } from "@/helper/image";
import { useCart } from "@/context";

interface FavoriteProductCardProps {
    id: number;
    title: string;
    category?: string;
    price: number;
    image: string;
    onRemove?: (id: number) => void;
}

export function FavoriteProductCard({
    id,
    title,
    category,
    price,
    image,
    onRemove,
}: FavoriteProductCardProps) {
    const router = useRouter();
    const { addToCart } = useCart();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await addToCart({
            id,
            name: title,
            price,
            image,
        } as any, 1, 'M');
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove?.(id);
    };

    return (
        <motion.div
            layout
            onClick={() => router.push(`/products/${id}`)}
            className="group relative flex items-center gap-6 p-4 md:p-6 bg-white border border-[#e7f1f3] rounded-2xl cursor-pointer hover:border-brand-teal/40 hover:shadow-sm transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative size-24 md:size-32 overflow-hidden rounded-xl bg-background-light flex-shrink-0 border border-gray-100">
                <Image
                    src={getImageUrl(image)}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 96px, 128px"
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-serif text-zinc-900 group-hover:text-brand-teal transition-colors truncate">
                        {title}
                    </h3>
                    <div className="flex items-center gap-3">
                        {category && (
                            <>
                                <span className="text-xs text-brand-teal uppercase tracking-wider font-semibold">
                                    {category}
                                </span>
                                <span className="text-zinc-300">|</span>
                            </>
                        )}
                        <span className="text-sm font-bold text-zinc-900">
                            Rs. {price.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-brand-teal text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#1499b5] transition-all rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">shopping_bag</span>
                        Add to Bag
                    </button>

                    <button
                        onClick={handleRemove}
                        className="size-10 flex items-center justify-center border border-zinc-100 text-zinc-400 hover:text-brand-teal hover:border-brand-teal/30 hover:bg-[#e7f1f3]/60 transition-all rounded-xl cursor-pointer"
                        title="Remove from favorites"
                    >
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
