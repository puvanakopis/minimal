"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { name: "Profile", href: "/profile", icon: "person" },
    { name: "My Orders", href: "/orders", icon: "shopping_basket" },
    { name: "My Favorites", href: "/favorites", icon: "favorite_border" },
    { name: "Settings", href: "/settings", icon: "settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-1/5 h-[calc(100vh-80px)] sticky top-20 hidden lg:flex flex-col gap-8 border-r border-[#e7f1f3] bg-[#f6f8f8] py-20 px-10">
            <div className="mb-10">
                <h2 className="text-lg font-bold text-zinc-900 font-serif">
                    Puvanakopis
                </h2>
                <p className="text-xs text-zinc-500 tracking-widest mt-1 font-display">
                    puvan@example.com
                </p>
            </div>
            <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex items-center gap-4 py-3 pl-4 transition-all duration-200 ${isActive
                                ? "text-[#17b0cf] font-semibold"
                                : "text-zinc-500 hover:text-zinc-900"
                                }`}
                        >
                            {isActive && (
                                <span className="absolute left-0 w-[2px] h-full bg-[#17b0cf]" />
                            )}
                            <span className="material-symbols-outlined text-xl">
                                {item.icon}
                            </span>
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
                <Link
                    href="/logout"
                    className="flex items-center gap-4 py-3 mt-10 pl-4 text-zinc-400 hover:text-red-500 transition-all duration-200"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    <span className="text-sm">Logout</span>
                </Link>
            </nav>
        </aside>
    );
}