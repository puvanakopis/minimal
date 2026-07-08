"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
            >
                <h1 className="font-serif text-8xl font-light text-brand-teal md:text-9xl">
                    404
                </h1>
                <div className="space-y-2">
                    <h2 className="font-serif text-2xl font-medium md:text-3xl">
                        Page not found
                    </h2>
                    <p className="mx-auto max-w-md text-soft-charcoal/70">
                        The page you are looking for might have been moved, deleted, or
                        never existed in our collection.
                    </p>
                </div>
                <div className="pt-6">
                    <Link
                        href="/"
                        className="inline-block bg-brand-teal px-8 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-brand-teal/90"
                    >
                        RETURN TO HOME
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
