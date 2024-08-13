import { db } from '@/lib/db'

export async function getAllOrders() {
  try {
    const orders = await db.order.findMany({
      include: {
        ShippingAddress: true,
        lineItems: {
          include: {
            Product: true,
          },
        },
      },
    })
    return orders
  } catch (e) {
    console.error(e)
    return null
  }
}
