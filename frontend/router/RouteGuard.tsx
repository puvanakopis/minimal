'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/interfaces';

export const isUserAdmin = (user?: User | null): boolean => {
  if (!user || !user.role) return false;
  const role = user.role.toString().toLowerCase();
  return role === 'admin' || role === 'role_admin';
};

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdminPath = pathname.startsWith('/admin');
  const isAuthPath = pathname === '/login';

  const protectedUserPaths = [
    '/profile',
    '/orders',
    '/favorites',
    '/settings',
    '/shipping',
    '/payment',
  ];
  const isProtectedUserPath = protectedUserPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const admin = isUserAdmin(user);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // 1. Unauthenticated Guest:
      // If trying to access admin or protected customer routes, redirect to login
      if (isAdminPath || isProtectedUserPath) {
        router.replace('/login');
      }
    } else if (admin) {
      // 2. Admin User:
      // Admins are strictly restricted to Admin Management Pages (/admin/*).
      // If on any public or customer page, redirect immediately to /admin
      if (!isAdminPath) {
        router.replace('/admin');
      }
    } else {
      // 3. Regular Customer (role: user):
      // If trying to access admin panel or login page, redirect to home /
      if (isAdminPath || isAuthPath) {
        router.replace('/');
      }
    }
  }, [user, isLoading, pathname, router, admin, isAdminPath, isAuthPath, isProtectedUserPath]);

  // Prevent flashing unauthorized content while redirecting
  const isUnauthorized =
    !isLoading &&
    ((!user && (isAdminPath || isProtectedUserPath)) ||
      (admin && !isAdminPath) ||
      (!admin && user && (isAdminPath || isAuthPath)));

  if (isLoading || isUnauthorized) {
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

