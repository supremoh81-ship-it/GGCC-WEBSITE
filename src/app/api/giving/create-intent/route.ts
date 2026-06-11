import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  amount: z.number().min(1).max(100000),
  fund: z.string().min(1),
  coverFees: z.boolean().default(false),
  isAnonymous: z.boolean().default(false),
  note: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { amount, coverFees, email, firstName, lastName, fund, isAnonymous, note } = parsed.data
  const finalAmount = coverFees ? Math.round((amount * 1.029 + 0.30) * 100) : Math.round(amount * 100)

  const intent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: 'usd',
    receipt_email: email,
    metadata: {
      fund,
      donorName: `${firstName} ${lastName}`,
      email,
      isAnonymous: String(isAnonymous),
      note: note ?? '',
    },
  })

  await prisma.donation.create({
    data: {
      firstName,
      lastName,
      email,
      amount: amount,
      currency: 'USD',
      frequency: 'ONE_TIME',
      status: 'PENDING',
      stripePaymentId: intent.id,
      coverFees,
      isAnonymous,
      note: note ?? null,
    },
  })

  return NextResponse.json({ clientSecret: intent.client_secret })
}
