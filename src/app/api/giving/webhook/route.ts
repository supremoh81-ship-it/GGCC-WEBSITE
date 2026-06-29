import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { resend, FROM } from '@/lib/resend'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent

    await prisma.donation.updateMany({
      where: { stripePaymentId: intent.id },
      data: {
        status: 'COMPLETED',
        stripeChargeId: intent.latest_charge as string ?? null,
        receiptSent: true,
      },
    })

    const email = intent.receipt_email ?? intent.metadata?.email
    if (email) {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Thank you for your gift to GGCC',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #100B16; color: white; padding: 40px; border-radius: 16px;">
            <h1 style="color: #C9A84C; font-family: Georgia, serif;">Thank You for Your Gift</h1>
            <p>Dear ${intent.metadata?.donorName ?? 'Friend'},</p>
            <p>Your generous gift of <strong style="color: #C9A84C;">$${(intent.amount / 100).toFixed(2)}</strong> to the <strong>${intent.metadata?.fund ?? 'General Fund'}</strong> has been received.</p>
            <p>Your generosity is making a real difference in the lives of people around the world. We are grateful for your faithfulness.</p>
            <p style="color: #8A9BB8;">This email serves as your donation receipt. Please retain it for your records.</p>
            <p>In His service,<br><strong>The GGCC Team</strong></p>
          </div>
        `,
      })
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent
    await prisma.donation.updateMany({
      where: { stripePaymentId: intent.id },
      data: { status: 'FAILED' },
    })
  }

  return NextResponse.json({ received: true })
}
