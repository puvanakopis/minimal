"use client"

import { usePathname } from 'next/navigation'
import LogoIcon from './LogoIcon'
import useNavigateTo from '@/hooks/useNavigateTo'

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const navigateTo = useNavigateTo()
    const pathname = usePathname()

    if (pathname === '/login' || pathname.startsWith('/admin')) return null

    const navigationLinks = [
        { label: 'Shop All', path: '/shop' },
        { label: 'Women', path: '/women' },
        { label: 'Men', path: '/men' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
    ]

    const support = [
        { label: 'Shipping' },
        { label: 'Returns' },
        { label: 'Size Guide' },
        { label: 'FAQ' },
        { label: 'Customer Support' },
    ]

    const legalLinks = [
        { label: 'Privacy', path: '/privacy' },
        { label: 'Terms', path: '/terms' },
    ]

    return (
        <footer className="bg-black/20 py-12 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-10">

            {/* MAIN GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-10 sm:gap-12 lg:gap-14">

                {/* Brand */}
                <div className="space-y-6 max-w-sm">
                    <div className="flex items-center gap-3">
                        <div className="size-6 text-primary">
                            <LogoIcon />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest">Minimal</h2>
                    </div>
                    <p className="text-[#4e8b97] text-sm leading-relaxed">
                        Redefining modern apparel with a focus on simplicity, quality materials, and timeless silhouettes.
                    </p>
                    <div className="flex gap-4">
                        <a className="cursor-pointer text-[#4e8b97] hover:text-primary transition-colors" href="#">
                            <span className="material-symbols-outlined">social_leaderboard</span>
                        </a>
                        <a className="cursor-pointer text-[#4e8b97] hover:text-primary transition-colors" href="#">
                            <span className="material-symbols-outlined">camera</span>
                        </a>
                    </div>
                </div>

                {/* Navigation */}
                <div className="w-full">
                    <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h4>
                    <ul className="space-y-4 text-sm text-[#4e8b97]">
                        {navigationLinks.map((item) => (
                            <li key={item.label}>
                                <button
                                    type="button"
                                    className="cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => navigateTo(item.path, true)}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Service */}
                <div className="w-full">
                    <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Service</h4>
                    <ul className="space-y-4 text-sm text-[#4e8b97]">
                        {support.map((item) => (
                            <li key={item.label}>
                                <button
                                    type="button"
                                    className="cursor-pointer hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="w-full max-w-md">
                    <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Newsletter</h4>
                    <p className="text-sm text-[#4e8b97] mb-4">
                        Exclusives and new arrivals directly to your inbox.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <input
                            className="w-full sm:flex-1 bg-white border-none px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
                            placeholder="Email Address"
                            type="email"
                        />
                        <button className="w-full sm:w-auto px-6 py-3 bg-brand-teal text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-teal/80 transition-colors">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            {/* BOTTOM */}
            <div className="max-w-[1600px] mx-auto mt-12 sm:mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center md:items-start gap-4 text-[10px] uppercase tracking-[0.2em] text-[#4e8b97] text-center md:text-left">

                <p className="leading-relaxed max-w-md">
                    © {currentYear} Minimal Apparel. Crafted for the discerning.
                </p>

                <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
                    {legalLinks.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            className="cursor-pointer hover:text-primary transition-colors"
                            onClick={() => navigateTo(item.path, true)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </footer>
    )
}