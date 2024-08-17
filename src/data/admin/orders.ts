import { db } from '@/lib/db'

export async function getOrderWithDataById(orderId: number) {
  try {
    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        ShippingAddress: true,
        lineItems: {
          include: {
            Product: true,
          },
        },
      },
    })
    return order
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function getAllOrdersWithData() {
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

export async function shipOrder(
  orderId: number,
  shippoLabelId: string | undefined,
  labelUrl: string | undefined,
  courier: string | undefined,
  shippingService: string | undefined,
  trackingNumber: string | undefined,
  trackingUrl: string | undefined,
) {
  try {
    const order = await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        shippoLabelId,
        courier,
        shippingService,
        trackingNumber,
        trackingUrl,
        labelUrl,
        orderShippedDate: new Date(),
        orderStatus: 'SHIPPED',
      },
    })
    return order
  } catch (e) {
    console.error(e)
    return null
  }
}
