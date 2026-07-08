import { cookies } from 'next/headers';
import { findSessionById, findUserById } from '@/lib/db';

export async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie || !sessionCookie.value) return null;

    const session = await findSessionById(sessionCookie.value);
    if (!session || new Date(session.expiresAt) < new Date()) return null;

    const user = await findUserById(session.userId);
    if (!user || user.role !== 'admin') return null;

    return user;
  } catch (error) {
    console.error('verifyAdmin error:', error);
    return null;
  }
}
