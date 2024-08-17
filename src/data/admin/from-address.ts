import { db } from '@/lib/db'

export const getFromAddressById = async (id: number) => {
  try {
    const fromAddress = await db.shippingFromAddresses.findUnique({
      where: {
        id,
      },
      include: {
        shippingAddress: true,
      },
    })
    return fromAddress
  } catch (e) {
    console.error(e)
    return null
  }
}
