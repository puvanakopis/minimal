'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import LogoIcon from './LogoIcon'
import useNavigateTo from '@/hooks/useNavigateTo'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
    const [cartCount] = useState(0)
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const { user, logout } = useAuth()

    const navigateTo = useNavigateTo()
    const pathname = usePathname()

    const profileRef = useRef<HTMLDivElement>(null)

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Shop', path: '/shop' },
        { label: 'Women', path: '/women' },
        { label: 'Men', path: '/men' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
    ]

    const isAdmin = user?.role?.toString().toLowerCase() === 'admin' || user?.role?.toString().toLowerCase() === 'role_admin'

    const profileMenu = [
        ...(isAdmin
            ? [
                {
                    label: 'Admin Dashboard',
                    icon: 'dashboard',
                    path: '/admin',
                },
            ]
            : []),
        {
            label: 'Profile',
            icon: 'person',
            path: '/profile',
        },
        {
            label: 'My Orders',
            icon: 'shopping_bag',
            path: '/orders',
        },
        {
            label: 'My Favorites',
            icon: 'favorite',
            path: '/favorites',
        },
        {
            label: 'Settings',
            icon: 'settings',
            path: '/settings',
        },
    ]

    const isActive = (path: string) => pathname === path

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            )
        }
    }, [])

    const handleLogout = async () => {
        setProfileOpen(false)
        await logout()
    }

    if (pathname === '/login' || pathname.startsWith('/admin')) return null

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4">

                {/* LEFT SIDE */}
                <div className="flex items-center gap-6 lg:gap-12">

                    {/* LOGO */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="size-5 sm:size-6 text-primary">
                            <LogoIcon />
                        </div>

                        <button
                            type="button"
                            onClick={() => navigateTo('/', true)}
                            className="cursor-pointer text-lg sm:text-xl lg:text-2xl font-black tracking-tight uppercase text-black"
                        >
                            Minimal
                        </button>
                    </div>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => navigateTo(item.path, true)}
                                className={`cursor-pointer text-sm font-semibold transition-colors duration-200 ${isActive(item.path)
                                    ? 'text-primary'
                                    : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">

                    {/* SEARCH */}
                    <button className="hidden sm:flex items-center justify-center rounded-xl size-9 sm:size-10 bg-gray-100 hover:bg-gray-200 transition">
                        <span className="material-symbols-outlined text-[20px]">
                            search
                        </span>
                    </button>

                    {/* CART */}
                    <button
                        onClick={() => navigateTo('/cart', true)}
                        className="relative flex items-center justify-center rounded-xl size-9 sm:size-10 bg-gray-100 hover:bg-gray-200 transition"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            shopping_bag
                        </span>

                        <span className="absolute -top-1 -right-1 size-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    </button>

                    {/* PROFILE DROPDOWN */}
                    <div className="relative hidden sm:block" ref={profileRef}>
                        <button
                            onClick={() => {
                                if (user) {
                                    setProfileOpen(!profileOpen)
                                } else {
                                    navigateTo('/login', true)
                                }
                            }}
                            className="relative flex items-center justify-center rounded-xl size-9 sm:size-10 bg-gray-100 hover:bg-gray-200 transition overflow-hidden"
                        >
                            {user?.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt="Avatar"
                                    fill
                                    unoptimized={user.avatar.startsWith('data:') || user.avatar.startsWith('blob:') || user.avatar.startsWith('/uploads/')}
                                    className="object-cover"
                                    sizes="40px"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-[20px]">
                                    person
                                </span>
                            )}
                        </button>

                        {/* DROPDOWN MENU */}
                        {user && (
                            <div
                                className={`absolute right-0 top-14 w-64 rounded-2xl border border-gray-200 bg-white shadow-xl transition-all duration-200 overflow-hidden ${profileOpen
                                    ? 'opacity-100 visible translate-y-0'
                                    : 'opacity-0 invisible -translate-y-2'
                                    }`}
                            >
                                {/* USER INFO */}
                                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                                    {user.avatar && (
                                        <div className="relative size-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                            <Image
                                                src={user.avatar}
                                                alt="Avatar"
                                                fill
                                                unoptimized={user.avatar.startsWith('data:') || user.avatar.startsWith('blob:') || user.avatar.startsWith('/uploads/')}
                                                className="object-cover"
                                                sizes="40px"
                                            />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-bold text-black truncate">
                                            {user.firstName} {user.lastName}
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* MENU ITEMS */}
                                <div className="p-2">
                                    {profileMenu.map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                setProfileOpen(false)
                                                navigateTo(
                                                    item.path,
                                                    true
                                                )
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 transition text-sm font-medium text-gray-700"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {item.icon}
                                            </span>

                                            {item.label}
                                        </button>
                                    ))}

                                    {/* LOGOUT */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 transition text-sm font-medium text-red-500"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            logout
                                        </span>

                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden flex items-center justify-center rounded-xl size-9 bg-gray-100 hover:bg-gray-200 transition"
                    >
                        <span className="material-symbols-outlined">
                            {menuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="md:hidden px-6 pb-6 pt-4 space-y-4 bg-white border-t border-gray-200">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                                setMenuOpen(false)
                                navigateTo(item.path, true)
                            }}
                            className={`block text-sm font-semibold transition-colors duration-200 ${isActive(item.path)
                                ? 'text-primary'
                                : 'text-gray-700 hover:text-primary'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </header>
    )
}