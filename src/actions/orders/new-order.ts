import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { getUserByEmail } from '@/data/auth/user'
import { ShippingAddress, User } from '@prisma/client'
import { getProductByStripePriceId } from '@/data/admin/products'
import { notEmpty } from '@/lib/utils'
import { getAddressByAddressAndEmail } from '@/data/customers/address'

export const createOrder = async (
  event: Stripe.CheckoutSessionCompletedEvent,
) => {
  console.log('Webhook event hit')

  const checkoutSession = event.data.object as Stripe.Checkout.Session

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

  // get user and create an order in the database
  const stripeCustomerId = checkoutSession.customer as string

  const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId)
  if (!stripeCustomer.deleted) {
    console.log('stripeCustomer', stripeCustomer)
    const user = await getUserByEmail(stripeCustomer.email as string)
    console.log('user', user)

    let lineItems
    try {
      lineItems = await stripe.checkout.sessions.listLineItems(
        checkoutSession.id,
      )
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

    // check if the customer already has used this address
    const address: ShippingAddress = {
      id: 0,
      userId: user?.id || null,
      email: stripeCustomer.email as string,
      recipientName: checkoutSession.shipping_details?.name || null,
      addressLine1: checkoutSession.shipping_details?.address?.line1 || null,
      addressLine2: checkoutSession.shipping_details?.address?.line2 || null,
      city: checkoutSession.shipping_details?.address?.city || null,
      state: checkoutSession.shipping_details?.address?.state || null,
      zipCode: checkoutSession.shipping_details?.address?.postal_code || null,
      countryCode: checkoutSession.shipping_details?.address?.country || null,
      createdAt: timePlaced,
      updatedAt: timePlaced,
    }

    const existingAddress = await getAddressByAddressAndEmail(
      address,
      stripeCustomer.email as string,
    )
    let addressIdToAdd
    if (existingAddress) {
      addressIdToAdd = existingAddress.id
    }

    // create the order in the database
    try {
      if (addressIdToAdd) {
        await db.order.create({
          data: {
            userId: user?.id,
            email: stripeCustomer.email as string,
            createdAt: timePlaced,
            updatedAt: timePlaced,
            stripeOrderId: checkoutSession.id,
            stripeCustomerId: stripeCustomer.id,
            lineItems: {
              create: filteredLineItemsToAdd.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                pricePerUnitInCents: item.pricePaidInCents,
              })),
            },
            pricePaidInCents: totalPrice,
            shippingAddressId: addressIdToAdd,
          },
        })
      } else {
        const shippingAddress = await db.shippingAddress.create({
          data: {
            userId: user?.id,
            email: stripeCustomer.email as string,
            recipientName: checkoutSession.shipping_details?.name,
            addressLine1: checkoutSession.shipping_details?.address?.line1,
            addressLine2: checkoutSession.shipping_details?.address?.line2,
            city: checkoutSession.shipping_details?.address?.city,
            state: checkoutSession.shipping_details?.address?.state,
            zipCode: checkoutSession.shipping_details?.address?.postal_code,
            countryCode: checkoutSession.shipping_details?.address?.country,
            createdAt: timePlaced,
            updatedAt: timePlaced,
          },
        })

        await db.order.create({
          data: {
            userId: user?.id,
            email: stripeCustomer.email as string,
            createdAt: timePlaced,
            updatedAt: timePlaced,
            stripeOrderId: checkoutSession.id,
            stripeCustomerId: stripeCustomer.id,
            lineItems: {
              create: filteredLineItemsToAdd.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                pricePerUnitInCents: item.pricePaidInCents,
              })),
            },
            pricePaidInCents: totalPrice,
            shippingAddressId: shippingAddress.id,
          },
        })
      }
    } catch (e) {
      console.error('unable to create order', e)
      return { error: 'Unable to create order' }
    }

    // decrease inventory for each product that's been purchased in the lineItems array
    for (const item of filteredLineItemsToAdd) {
      try {
        const product = await db.product.update({
          where: {
            id: item.productId,
          },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        })
        if (product.inventory < 0) {
          throw new Error('Inventory is less than 0')
        }
      } catch (e) {
        console.error('an error occurred while decreasing inventory', e)
        return { error: 'Unable to decrease inventory' }
      }
    }
  }
}
