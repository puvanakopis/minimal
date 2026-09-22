'use client';

interface FilterProps {
    selectedCategories?: string[];
    onCategoryChange?: (category: string) => void;
    selectedSize?: string;
    onSizeChange?: (size: string) => void;
    priceRange?: number;
    onPriceChange?: (price: number) => void;
    onReset?: () => void;
}

export default function Filter({
    selectedCategories = [],
    onCategoryChange,
    selectedSize = '',
    onSizeChange,
    priceRange = 10000,
    onPriceChange,
    onReset,
}: FilterProps) {
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const categories = ['Outerwear', 'Tops', 'Trousers', 'Denim', 'Knitwear', 'Accessories', 'Loungewear'];

    const hasActiveFilters = selectedCategories.length > 0 || selectedSize || (priceRange && priceRange < 10000);

    return (
        <div className="space-y-8">
            {hasActiveFilters && onReset && (
                <div className="flex justify-between items-center pb-2 border-b border-[#e7f1f3]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#4e8b97]">Filters Active</span>
                    <button
                        type="button"
                        onClick={onReset}
                        className="text-xs text-brand-teal hover:underline font-semibold cursor-pointer"
                    >
                        Reset All
                    </button>
                </div>
            )}

            {/* Category Filter */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#e7f1f3] text-zinc-900">
                    Category
                </h4>
                <ul className="space-y-2.5">
                    {categories.map((cat) => (
                        <li key={cat}>
                            <label className="flex items-center gap-3 text-sm cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => onCategoryChange?.(cat)}
                                    className="size-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal cursor-pointer"
                                />
                                <span className={`transition-colors text-xs uppercase tracking-wider ${selectedCategories.includes(cat) ? 'text-brand-teal font-bold' : 'text-gray-600 group-hover:text-brand-teal'}`}>
                                    {cat}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Size Filter */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#e7f1f3] text-zinc-900">
                    Size
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                        <button
                            type="button"
                            key={size}
                            onClick={() => onSizeChange?.(selectedSize === size ? '' : size)}
                            className={`py-2 text-xs border rounded-lg transition-all duration-200 uppercase cursor-pointer
                                 ${selectedSize === size
                                    ? 'border-brand-teal bg-brand-teal text-white shadow-sm font-bold'
                                    : 'border-gray-200 text-gray-700 hover:border-brand-teal hover:bg-brand-teal/10'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
                {selectedSize && (
                    <p className="text-[11px] text-[#4e8b97] mt-2 font-medium">
                        Filtered by Size: <span className="font-bold text-zinc-900">{selectedSize}</span>
                    </p>
                )}
            </div>

            {/* Price Range Filter */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#e7f1f3] text-zinc-900">
                    Price Range
                </h4>
                <div className="space-y-3">
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        step="250"
                        value={priceRange}
                        onChange={(e) => onPriceChange?.(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#1499b5]"
                    />
                    <div className="flex justify-between text-xs text-[#4e8b97] font-medium">
                        <span>Rs. 0</span>
                        <span>Up to Rs. {priceRange?.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
