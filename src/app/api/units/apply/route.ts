import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  unitName: z.string().min(2).max(120),
  fullName: z.string().min(2).max(150),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  phone: z.string().max(30).optional().or(z.literal('')),
  email: z.string().email().max(200).optional().or(z.literal('')),
  reasonForJoining: z.string().min(10).max(2000),
  salvationExperience: z.string().min(10).max(2000),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten() }, { status: 400 })
  }

  const { unitName, fullName, dateOfBirth, phone, email, reasonForJoining, salvationExperience } = parsed.data

  try {
    await prisma.unitMember.create({
      data: {
        unitName,
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        phone: phone || null,
        email: email || null,
        reasonForJoining,
        salvationExperience,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Could not save your application. Please try again.' }, { status: 500 })
  }
}
