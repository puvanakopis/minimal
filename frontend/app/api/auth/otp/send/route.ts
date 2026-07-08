import { NextResponse } from 'next/server';
import { findUserByEmail, saveOtp } from '@/lib/db';
import { sendMail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type are required' }, { status: 400 });
    }

    if (type !== 'signup' && type !== 'forgot-password') {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    const user = await findUserByEmail(email);

    if (type === 'signup' && user) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    if (type === 'forgot-password' && !user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    await saveOtp({
      email,
      otp,
      expiresAt,
      type,
    });

    const subject = type === 'signup' ? 'Verify your Minimal Sign Up' : 'Reset your Minimal Password';
    const bodyText = `Your OTP is ${otp}. It will expire in 5 minutes.`;
    const bodyHtml = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e7f1f3; rounded: 12px;">
        <h2 style="color: #1a1a1a; font-family: serif; font-size: 24px;">MINIMAL</h2>
        <p style="font-size: 14px; color: #555;">Use the following One Time Password (OTP) to complete your request:</p>
        <div style="background-color: #f6f8f8; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #17b0cf;">${otp}</span>
        </div>
        <p style="font-size: 11px; color: #999;">This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `;

    await sendMail({
      to: email,
      subject,
      text: bodyText,
      html: bodyHtml,
    });

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('OTP Send error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
