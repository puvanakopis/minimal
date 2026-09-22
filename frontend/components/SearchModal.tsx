'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { productService } from '@/services/product.service';
import { Product } from '@/interfaces';
import { getImageUrl } from '@/helper/image';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const POPULAR_SEARCHES = [
    'Outerwear',
    'Tops',
    'Denim',
    'Knitwear',
    'Trousers',
    'Accessories',
    'Cotton',
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [, startTransition] = useTransition();

    // Auto focus on open & reset state
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setHasSearched(false);
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Handle ESC key and backdrop lock
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Debounced live search
    useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            setResults([]);
            setLoading(false);
            setHasSearched(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const response = await productService.getProducts({ search: trimmed });
                if (response.success && response.data) {
                    setResults(response.data);
                } else {
                    setResults([]);
                }
            } catch (err) {
                console.error('Search error:', err);
                setResults([]);
            } finally {
                setLoading(false);
                setHasSearched(true);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectProduct = (productId: number | string) => {
        onClose();
        startTransition(() => {
            router.push(`/products/${productId}`);
        });
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;

        onClose();
        startTransition(() => {
            router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
        });
    };

    const handleSuggestionClick = (tag: string) => {
        setQuery(tag);
        inputRef.current?.focus();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 md:pt-20 px-4 sm:px-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -20 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 max-h-[85vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input Bar */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="relative flex items-center px-4 sm:px-6 py-4 border-b border-gray-100 bg-white"
                        >
                            <Search className="w-5 h-5 text-gray-400 shrink-0 mr-3" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products, collections, styles..."
                                className="w-full text-base sm:text-lg font-medium text-gray-900 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                            />

                            {/* Loading Spinner or Clear Button */}
                            <div className="flex items-center gap-2 ml-2">
                                {loading && (
                                    <Loader2 className="w-5 h-5 text-brand-teal animate-spin" />
                                )}
                                {query && !loading && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQuery('');
                                            setResults([]);
                                            setHasSearched(false);
                                            inputRef.current?.focus();
                                        }}
                                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                                        title="Clear search"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer ml-1"
                                    title="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </form>

                        {/* Modal Body / Results */}
                        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
                            {/* Empty state: Suggestions */}
                            {!query.trim() && (
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                                        <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
                                        <span>Popular Searches</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {POPULAR_SEARCHES.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => handleSuggestionClick(tag)}
                                                className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-brand-teal/10 hover:text-brand-teal text-gray-700 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Live Results List */}
                            {query.trim() && results.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                        <span>Products ({results.length})</span>
                                        <span className="text-[11px] font-normal lowercase">Press enter to view all</span>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {results.slice(0, 6).map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => handleSelectProduct(product.id)}
                                                className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-50 transition cursor-pointer group"
                                            >
                                                {/* Thumbnail */}
                                                <div className="relative size-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                                    <Image
                                                        src={getImageUrl(product.image || product.mainImage)}
                                                        alt={product.name}
                                                        fill
                                                        unoptimized
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        sizes="56px"
                                                    />
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-brand-teal transition-colors">
                                                        {product.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {product.category && (
                                                            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                                                                {product.category}
                                                            </span>
                                                        )}
                                                        {product.category && <span className="text-gray-300">•</span>}
                                                        <span className="text-xs font-bold text-gray-900">
                                                            Rs. {product.price?.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Arrow */}
                                                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-brand-teal group-hover:text-white text-gray-400 transition-colors">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No results state */}
                            {query.trim() && !loading && hasSearched && results.length === 0 && (
                                <div className="py-10 text-center space-y-2">
                                    <div className="inline-flex items-center justify-center size-12 rounded-full bg-gray-100 text-gray-400 mb-2">
                                        <Search className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        No products found for &ldquo;{query}&rdquo;
                                    </h3>
                                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                        Check your spelling or try searching for another term, category, or style.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {query.trim() && results.length > 0 && (
                            <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    Found <strong className="text-gray-900">{results.length}</strong> matching item{results.length !== 1 ? 's' : ''}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleSearchSubmit()}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1499b5] transition shadow-sm cursor-pointer"
                                >
                                    <span>View all results</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
