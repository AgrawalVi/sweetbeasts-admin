import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { getUserByEmail } from '@/data/auth/user'
import { User } from '@prisma/client'
import { getProductByStripePriceId } from '@/data/admin/products'
import { notEmpty } from '@/lib/utils'

export const createOrder = async (
  event: Stripe.CheckoutSessionCompletedEvent,
) => {
  const checkoutSession = event.data.object

  // check that the session is completed
  if (checkoutSession.status !== 'complete') {
    return
  }

  // verify that the payment has been processed before moving forward
  if (checkoutSession.payment_status !== 'paid') {
    return
  }

  // get order information from event
  const timePlaced = new Date(event.created * 1000)

  // need to get line items from a checkout session and decrease the inventory in our database
  const lineItems = checkoutSession.line_items?.data

  // get user and create an order in the database
  const stripeCustomerId = checkoutSession.customer as string

  const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId)
  if (!stripeCustomer.deleted) {
    const user = await getUserByEmail(checkoutSession.customer_email)
    // if the user already exists, we have to add the order ot their order history
    if (user) {
      // create order in database
      const order = await createOrderHelper(
        checkoutSession,
        timePlaced,
        user,
        stripeCustomer,
        stripeCustomer.email as string,
      )
    } else {
      const order = await createOrderHelper(
        checkoutSession,
        timePlaced,
        user,
        stripeCustomer,
        stripeCustomer.email as string,
      )
    }
  }

  // link order to customer based off email or stripe customer id
}

const createOrderHelper = async (
  session: Stripe.Checkout.Session,
  timePlaced: Date,
  user: User | null,
  stripeCustomer: Stripe.Customer,
  email: string,
) => {
  console.log('Webhook event hit')
  let lineItems
  try {
    lineItems = await stripe.checkout.sessions.listLineItems(session.id)
  } catch (e) {
    console.error('unable to get line items', e)
    return { error: 'Unable to get line items' }
  }

  let lineItemsToAdd = await Promise.all(
    lineItems.data.map(async (item) => {
      const product = await getProductByStripePriceId(item.price?.id)
      if (!product) {
        return null
      } else {
        return {
          productId: product.id,
          quantity: item.quantity as number,
          pricePaidInCents: item.price?.unit_amount as number,
        }
      }
    }),
  )

  // add up all the prices to get the total price paid in the lineItems array
  let totalPrice = 0
  lineItems.data.forEach((item) => {
    totalPrice +=
      (item.price?.unit_amount as number) * (item.quantity as number)
  })

  let filteredLineItemsToAdd = lineItemsToAdd.filter(notEmpty)

  try {
    await db.order.create({
      data: {
        userId: user?.id,
        email,
        createdAt: timePlaced,
        stripeOrderId: session.id,
        stripeCustomerId: stripeCustomer.id,
        shippingAddress: {
          create: {
            userId: user?.id,
            recipientName: session.shipping_details?.name,
            addressLine1: session.shipping_details?.address?.line1,
            addressLine2: session.shipping_details?.address?.line2,
            city: session.shipping_details?.address?.city,
            state: session.shipping_details?.address?.state,
            zipCode: session.shipping_details?.address?.postal_code,
            countryCode: session.shipping_details?.address?.country,
            createdAt: timePlaced,
          },
        },
        lineItems: {
          create: filteredLineItemsToAdd.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnitInCents: item.pricePaidInCents,
          })),
        },
        pricePaidInCents: totalPrice,
      },
    })
  } catch (e) {
    console.error('unable to create order', e)
    return { error: 'Unable to create order' }
  }
}
