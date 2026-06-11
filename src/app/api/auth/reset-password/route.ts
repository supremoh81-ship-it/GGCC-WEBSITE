import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = schema.parse(body)

    const record = await prisma.passwordResetToken.findUnique({ where: { token } })

    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Reset link has expired or is invalid.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { email: record.email },
      data: { passwordHash },
    })

    await prisma.passwordResetToken.delete({ where: { token } })

    return NextResponse.json({ message: 'Password updated successfully.' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    console.error('[RESET_PASSWORD]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
