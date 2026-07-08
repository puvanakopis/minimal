import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendMail(options: EmailOptions): Promise<void> {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    EMAIL_USER,
    EMAIL_PASS
  } = process.env;

  // 1. Check if Gmail App Password config (EMAIL_USER & EMAIL_PASS) is provided
  if (EMAIL_USER && EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`Email sent successfully via Gmail to ${options.to}`);
      return;
    } catch (err) {
      console.error('Gmail SMTP sending failed, falling back:', err);
    }
  }

  // 2. Check if generic SMTP configuration is provided
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || '587'),
        secure: SMTP_PORT === '465',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: SMTP_FROM || `"Minimal Store" <noreply@minimal.com>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`Email sent successfully via SMTP to ${options.to}`);
      return;
    } catch (err) {
      console.error('Generic SMTP Email sending failed, falling back to console:', err);
    }
  }
}