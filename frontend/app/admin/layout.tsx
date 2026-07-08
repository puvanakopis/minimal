'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, LogOut, Loader2, ArrowLeft } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.role === 'admin') {
            setUser(data.user);
            setLoading(false);
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
        router.push('/login');
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-brand-teal" />
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">Checking Authorization...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] flex">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-[#e7f1f3] bg-white flex flex-col justify-between p-6">
        <div className="space-y-10">
          {/* BRAND */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold uppercase tracking-widest text-[#1a1a1a]">MINIMAL</span>
              <span className="text-[9px] uppercase tracking-widest bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded font-black">ADMIN</span>
            </Link>
          </div>

          {/* USER INFO */}
          <div className="p-4 bg-off-white rounded-2xl border border-[#e7f1f3]">
            <h4 className="text-xs font-bold text-[#1a1a1a]">{user?.firstName} {user?.lastName}</h4>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">{user?.email}</p>
          </div>

          {/* MENU */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-teal text-white shadow-md'
                      : 'text-gray-500 hover:text-brand-teal hover:bg-brand-teal/5'
                  }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-brand-teal hover:bg-brand-teal/5 transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 transition-all duration-300 cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
