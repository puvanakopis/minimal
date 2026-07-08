'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        const user: User | null = data.user;

        const isAdminPath = pathname.startsWith('/admin');
        const isAuthPath = pathname === '/login';
        
        // List of pages that require user login
        const protectedUserPaths = ['/profile', '/orders', '/favorites', '/settings', '/shipping', '/payment'];
        const isProtectedUserPath = protectedUserPaths.some(path => pathname.startsWith(path));

        if (!user) {
          // Guest User: If they try to access admin or protected user pages, redirect to login
          if (isAdminPath || isProtectedUserPath) {
            router.push('/login');
          } else {
            setLoading(false);
          }
        } else if (user.role === 'admin') {
          // Admin User: Admins can ONLY access admin pages.
          if (!isAdminPath) {
            router.push('/admin');
          } else {
            setLoading(false);
          }
        } else {
          // Regular User: Users can ONLY access user pages, NOT admin pages.
          if (isAdminPath) {
            router.push('/');
          } else if (isAuthPath) {
            router.push('/');
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Route Guard Error:', err);
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-brand-teal" />
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">Verifying Route Access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
