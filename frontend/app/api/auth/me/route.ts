import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findSessionById, findUserById, deleteSession } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ user: null });
    }

    const session = await findSessionById(sessionCookie.value);
    if (!session) {
      // Clear invalid cookie
      cookieStore.delete('session');
      return NextResponse.json({ user: null });
    }

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      await deleteSession(session.id);
      cookieStore.delete('session');
      return NextResponse.json({ user: null });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      await deleteSession(session.id);
      cookieStore.delete('session');
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role || 'user',
      },
    });
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null });
  }
}
