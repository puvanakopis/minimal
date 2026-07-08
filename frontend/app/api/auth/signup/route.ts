import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByEmail, saveUser, verifyOtp } from '@/lib/db';
import { hashPassword, generateSessionId } from '@/lib/auth';
import { saveSession } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, otp } = await request.json();

    if (!firstName || !lastName || !email || !password || !otp) {
      return NextResponse.json(
        { error: 'All fields, including OTP, are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isOtpValid = await verifyOtp(email, otp, 'signup');
    if (!isOtpValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    const { hash, salt } = hashPassword(password);
    const userId = crypto.randomUUID();

    const newUser = {
      id: userId,
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
      role: 'user' as const,
    };

    await saveUser(newUser);

    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    await saveSession({
      id: sessionId,
      userId,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(expiresAt),
    });

    return NextResponse.json({
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
