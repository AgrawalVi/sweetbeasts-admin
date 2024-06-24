import { createOrder } from '@/actions/orders/new-order'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const POST = async (req: Request, res: Response) => {
  const rawBody = await req.text()
  const body = JSON.parse(rawBody)

  let event

  // verify the webhook signature to be sure that the request came from Stripe
  try {
    const sig = req.headers.get('Stripe-Signature')
    if (!sig) {
      throw new Error('Stripe signature missing')
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 },
    )
  }

  if (event.type === 'checkout.session.completed') {
    createOrder(event)
  }

  return NextResponse.json({ status: 200 })
}
