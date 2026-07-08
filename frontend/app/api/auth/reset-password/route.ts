import { NextResponse } from 'next/server';
import { findUserByEmail, verifyOtp } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify OTP
    const isOtpValid = await verifyOtp(email, otp, 'forgot-password');
    if (!isOtpValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Update password hash/salt in MongoDB
    const { hash, salt } = hashPassword(newPassword);
    const { db } = await connectToDatabase();

    await db.collection('users').updateOne(
      { id: user.id },
      { $set: { passwordHash: hash, salt } }
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
