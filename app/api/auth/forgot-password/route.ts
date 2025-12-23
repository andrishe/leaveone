import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimiters } from '@/lib/rate-limit';
import { errorResponse, ValidationError } from '@/lib/errors';
import { z } from 'zod';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting
    await rateLimiters.auth(request);

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Find user
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists and is active
    if (user && user.isActive) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Token expires in 1 hour
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // Store token in database (you'll need to add this table to schema)
      // For now, we'll use a session-like approach
      // TODO: Add PasswordResetToken model to Prisma schema

      // Send email with reset link
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

      // TODO: Send email with reset link
      console.log(`Password reset link for ${email}: ${resetUrl}`);

      // In production, use the email service:
      // await sendPasswordResetEmail({
      //   to: user.email,
      //   name: user.name,
      //   resetUrl,
      // });
    }

    // Always return success (security best practice)
    return NextResponse.json({
      message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    });
  } catch (error) {
    return errorResponse(error);
  }
}
