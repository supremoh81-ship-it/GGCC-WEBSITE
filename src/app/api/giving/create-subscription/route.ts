import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const schema = z.object({
  amount: z.number().min(1).max(100000),
  frequency: z.enum(['WEEKLY', 'MONTHLY', 'ANNUALLY']),
  fundId: z.string().optional(),
  coverFees: z.boolean().default(false),
  paymentMethodId: z.string(),
})

const STRIPE_INTERVALS: Record<string, { interval: 'week' | 'month' | 'year'; interval_count: number }> = {
  WEEKLY: { interval: 'week', interval_count: 1 },
  MONTHLY: { interval: 'month', interval_count: 1 },
  ANNUALLY: { interval: 'year', interval_count: 1 },
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Sign in to set up recurring giving' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { amount, frequency, fundId, coverFees, paymentMethodId } = parsed.data
  const feeAmount = coverFees ? Math.round(amount * 0.029 + 0.30) : 0
  const totalCents = Math.round((amount + feeAmount) * 100)

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: { userId: user.id },
      })
      customerId = customer.id
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } })
    }

    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId })
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    const intervalConfig = STRIPE_INTERVALS[frequency]
    const price = await stripe.prices.create({
      unit_amount: totalCents,
      currency: 'usd',
      recurring: intervalConfig,
      product_data: { name: `GGCC ${frequency.toLowerCase()} giving` },
    })

    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: price.id }],
      metadata: {
        userId: user.id,
        fundId: fundId ?? '',
        coverFees: String(coverFees),
      },
    })

    const fund = fundId ? await prisma.givingCampaign.findUnique({ where: { id: fundId } }) : null

    const sub = await prisma.givingSubscription.create({
      data: {
        userId: user.id,
        stripeSubscriptionId: stripeSubscription.id,
        amount,
        frequency,
        status: stripeSubscription.status.toUpperCase(),
        currentPeriodEnd: new Date((stripeSubscription as { current_period_end?: number }).current_period_end ? (stripeSubscription as { current_period_end: number }).current_period_end * 1000 : Date.now()),
      },
    })

    await prisma.donation.create({
      data: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        amount,
        frequency,
        status: 'PENDING',
        stripePaymentId: stripeSubscription.id,
        coverFees,
        campaignId: fundId ?? null,
        note: fund ? `${fund.title} - recurring ${frequency.toLowerCase()}` : `Recurring ${frequency.toLowerCase()} gift`,
      },
    })

    return NextResponse.json({ data: { subscriptionId: sub.id } }, { status: 201 })
  } catch (err) {
    console.error('[GIVING_SUBSCRIPTION]', err)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}
