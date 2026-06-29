import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const schema = z.object({ email: z.string().email() })
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_build_key')

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

      await prisma.passwordResetToken.deleteMany({ where: { email } })
      await prisma.passwordResetToken.create({
        data: { email, token, expiresAt },
      })

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ggcc.church'}/reset-password?token=${token}`

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@ggcc.church',
        to: email,
        subject: 'Reset your GGCC password',
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0A1628;color:#ffffff;border-radius:16px;">
            <h2 style="color:#C9A84C;font-size:24px;margin-bottom:16px;">Password Reset</h2>
            <p style="color:#94a3b8;margin-bottom:24px;">
              You requested a password reset for your GGCC account. Click the button below to set a new password.
              This link expires in 1 hour.
            </p>
            <a href="${resetUrl}" style="display:inline-block;background:#C9A84C;color:#0A1628;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
              Reset Password
            </a>
            <p style="color:#64748b;font-size:12px;margin-top:24px;">
              If you did not request this, please ignore this email. Your password will not change.
            </p>
          </div>
        `,
      })
    }

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    console.error('[FORGOT_PASSWORD]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
