import { NextResponse } from 'next/server';
import { findUserByEmail, saveOtp } from '@/lib/db';
import { sendMail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    await saveOtp({
      email,
      otp,
      expiresAt,
      type: 'forgot-password',
    });

    const subject = 'Reset your Minimal Password';
    const bodyText = `Your password reset OTP is ${otp}. It will expire in 5 minutes.`;
    const bodyHtml = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e7f1f3; rounded: 12px;">
        <h2 style="color: #1a1a1a; font-family: serif; font-size: 24px;">MINIMAL</h2>
        <p style="font-size: 14px; color: #555;">Use the following One Time Password (OTP) to reset your password:</p>
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

    return NextResponse.json({
      message: 'If the email exists, an OTP has been sent.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
