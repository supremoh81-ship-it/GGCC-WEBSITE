import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { contactSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { firstName, lastName, email, phone, subject, message, department } = parsed.data

  await prisma.contactSubmission.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      subject: `[${department.toUpperCase()}] ${subject}`,
      message,
    },
  })

  if (resend) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@ggcc.church',
      to: 'connect@ggcc.church',
      reply_to: email,
      subject: `[${department.toUpperCase()}] ${subject}`,
      html: `
        <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
        <p><strong>Phone:</strong> ${phone ?? 'N/A'}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    })
  }

  return NextResponse.json({ message: 'Message received' }, { status: 201 })
}
