'use client';

import { useState } from 'react';

export default function Filter() {
    const [priceRange, setPriceRange] = useState(750);
    const [selectedSize, setSelectedSize] = useState('S');
    const [selectedColor, setSelectedColor] = useState('Grey');

    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const colors = [
        { name: 'Black', value: 'bg-black' },
        { name: 'White', value: 'bg-white' },
        { name: 'Tan', value: 'bg-[#D2B48C]' },
        { name: 'Grey', value: 'bg-[#5F6062]' },
        { name: 'Forest', value: 'bg-[#1E2F23]' },
    ];
    const categories = ['Shirts', 'Trousers', 'Outerwear', 'Loungewear'];

    return (
        <div className="space-y-10">
            {/* Category Filter */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#e7f1f3]">
                    Category
                </h4>
                <ul className="space-y-3">
                    {categories.map((cat) => (
                        <li key={cat}>
                            <label className="flex items-center gap-3 text-sm cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="size-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
                                />
                                <span className="group-hover:text-brand-teal transition-colors">
                                    {cat}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Size Filter */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#e7f1f3]">
                    Size
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                        <button
                          type="button"
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 text-xs border transition-all duration-200 uppercase
                               ${selectedSize === size
                                  ? 'border-brand-teal bg-brand-teal text-white shadow-sm'
                                  : 'border-white/35 hover:border-brand-teal hover:bg-brand-teal/10'
                              }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Filter */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#e7f1f3]">
                    Color
                </h4>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button
                            type="button"
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={`size-6 rounded-full border-2 transition-colors border-[#7ea2ac] hover:border-brand-teal ${color.value
                                } ${selectedColor === color.name
                                    ? 'border-brand-teal ring-2 ring-brand-teal ring-offset-2'
                                    : ''
                                }`}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#e7f1f3]">
                    Price Range
                </h4>
                <div className="space-y-4">
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#1499b5]"
                        style={{
                            background: `linear-gradient(to right, #1499b5 0%, #1499b5 ${priceRange / 10}%, #d7e6e9 ${priceRange / 10}%, #d7e6e9 100%)`,
                        }}
                    />
                    <div className="flex justify-between text-xs text-[#4e8b97] font-medium">
                        <span>Rs 0</span>
                        <span>Rs {priceRange}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
