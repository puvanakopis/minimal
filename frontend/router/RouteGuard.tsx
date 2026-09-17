'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isAdminPath = pathname.startsWith('/admin');
    const isAuthPath = pathname === '/login';

    // List of pages that require user login
    const protectedUserPaths = ['/profile', '/orders', '/favorites', '/settings', '/shipping', '/payment'];
    const isProtectedUserPath = protectedUserPaths.some((path) => pathname.startsWith(path));

    const isAdminRole = user?.role === 'ROLE_ADMIN' || user?.role === 'admin';

    if (!user) {
      // Guest User: If they try to access admin or protected user pages, redirect to login
      if (isAdminPath || isProtectedUserPath) {
        router.push('/login');
      }
    } else if (isAdminRole) {
      // Admin User: Admins can ONLY access admin pages.
      if (!isAdminPath) {
        router.push('/admin');
      }
    } else {
      // Regular User: Users can ONLY access user pages, NOT admin pages.
      if (isAdminPath) {
        router.push('/');
      } else if (isAuthPath) {
        router.push('/');
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
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
