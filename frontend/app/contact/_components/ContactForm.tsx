'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const categories = [
    { id: 'order', label: 'Order & Shipping' },
    { id: 'returns', label: 'Returns & Refund' },
    { id: 'product', label: 'Product Inquiries' },
    { id: 'technical', label: 'Technical Issues' },
    { id: 'general', label: 'General Inquiry' },
];

export default function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('order');
    const [message, setMessage] = useState('');

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const tempErrors: { [key: string]: string } = {};
        if (!name.trim()) tempErrors.name = 'Name is required';
        if (!email.trim()) {
            tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            tempErrors.email = 'Please enter a valid email address';
        }
        if (!message.trim()) tempErrors.message = 'Message is required';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus('submitting');

        // Simulate API network latency (1.5 seconds)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Randomly succeed for mock simulation (always succeeds in this case)
        setStatus('success');
    };

    const handleReset = () => {
        setName('');
        setEmail('');
        setCategory('order');
        setMessage('');
        setStatus('idle');
        setErrors({});
    };

    // Helper for direct mail link fallback
    const mailtoUrl = `mailto:support@minimal.com?subject=[${categories.find(c => c.id === category)?.label}] Issue from ${encodeURIComponent(name)}&body=Name: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;

    return (
        <div className="bg-white border border-[#e7f1f3] p-8 sm:p-12 md:p-16 rounded-3xl relative overflow-hidden">
            <AnimatePresence mode="wait">
                {status !== 'success' ? (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-10"
                        noValidate
                    >
                        <div className="space-y-2 text-center lg:text-left">
                            <h1 className="font-serif text-3xl font-normal tracking-wide text-[#1a1a1a]">
                                Report an Issue
                            </h1>
                            <p className="text-xs text-brand-teal tracking-wider">
                                Fill out the details below. Our concierge support team will resolve your request shortly.
                            </p>
                        </div>

                        {/* Form Fields Stack */}
                        <div className="space-y-8">
                            {/* Name Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value)
                                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                                    }}
                                    className="w-full bg-transparent border-b border-gray-300 py-3.5 px-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
                                    placeholder="Your Name"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
                                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
                                    peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
                                    peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                                >
                                    Your Name
                                </label>
                                {errors.name && (
                                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-semibold tracking-wide">
                                        <span className="material-symbols-outlined text-[14px]">error</span> {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email Input */}
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                                    }}
                                    className="w-full bg-transparent border-b border-gray-300 py-3.5 px-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a]"
                                    placeholder="Your Email"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
                                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
                                    peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
                                    peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                                >
                                    Your Email
                                </label>
                                {errors.email && (
                                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-semibold tracking-wide">
                                        <span className="material-symbols-outlined text-[14px]">error</span> {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Category Selector */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-[0.15em] text-[#4e8b97] block">
                                Select Issue Category
                            </label>
                            <div className="flex flex-wrap gap-2.5">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-all duration-300 cursor-pointer
                                                ${category === cat.id
                                                ? 'bg-brand-teal border-brand-teal text-white shadow-md shadow-brand-teal/20'
                                                : 'bg-white border-[#e7f1f3] text-[#4e8b97] hover:border-brand-teal/50 hover:text-brand-teal'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="relative">
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value)
                                    if (errors.message) setErrors(prev => ({ ...prev, message: '' }))
                                }}
                                className="w-full bg-transparent border-b border-gray-300 py-3.5 px-1 text-sm outline-none focus:border-brand-teal focus:ring-0 transition-colors peer placeholder-transparent text-[#1a1a1a] min-h-[120px] resize-none"
                                placeholder="Describe the Issue"
                            />
                            <label
                                htmlFor="message"
                                className="absolute left-1 top-3.5 text-xs text-[#4e8b97] tracking-wider pointer-events-none transition-all duration-300 
                                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#4e8b97] 
                                    peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-teal 
                                    peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#4e8b97]"
                            >
                                Describe the Issue
                            </label>
                            {errors.message && (
                                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-semibold tracking-wide">
                                    <span className="material-symbols-outlined text-[14px]">error</span> {errors.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {status === 'submitting' ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <>
                                    Submit Request
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="py-12 text-center space-y-8"
                    >
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                                className="p-4 rounded-full bg-brand-teal/10 text-brand-teal"
                            >
                                <CheckCircle2 className="size-16 stroke-[1.5]" />
                            </motion.div>
                        </div>

                        <div className="space-y-3 max-w-md mx-auto">
                            <h3 className="text-3xl font-serif italic text-soft-charcoal">
                                Message Transmitted
                            </h3>
                            <p className="text-sm font-light text-[#4e8b97] leading-relaxed">
                                Thank you, <span className="font-semibold text-soft-charcoal">{name}</span>. Your issue ticket has been registered under category <span className="font-semibold text-brand-teal">{categories.find(c => c.id === category)?.label}</span>. We will follow up at <span className="font-semibold text-soft-charcoal">{email}</span> in a brief moment.
                            </p>
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href={mailtoUrl}
                                className="inline-flex items-center justify-center px-6 py-3 border border-brand-teal text-brand-teal text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-brand-teal hover:text-white transition-all duration-300"
                            >
                                Send Direct Email Copy
                            </a>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-3 bg-[#f8f8f7] border border-transparent text-soft-charcoal text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-[#d0e3e7] transition-all duration-300"
                            >
                                Submit Another Issue
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
