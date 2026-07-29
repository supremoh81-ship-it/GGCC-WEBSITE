import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { format } from 'date-fns'

const schema = z.object({
  unitName: z.string().min(2).max(120),
  memberName: z.string().min(2).max(150),
  reportText: z.string().min(10).max(5000),
  activityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
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

  const { unitName, memberName, reportText, activityDate } = parsed.data
  const date = new Date(activityDate)
  const reportMonth = format(date, 'yyyy-MM')

  try {
    await prisma.unitReport.create({
      data: {
        unitName,
        memberName,
        reportText,
        activityDate: date,
        reportMonth,
      },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Could not save your report. Please try again.' }, { status: 500 })
  }
}
