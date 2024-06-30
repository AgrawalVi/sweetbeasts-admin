import { db } from '@/lib/db'
import { ShippingAddress } from '@prisma/client'

export const getAddressByAddressAndEmail = async (
  address: ShippingAddress,
  email: string,
) => {
  // first get all addresses for the user:
  let addresses: ShippingAddress[] = []
  try {
    addresses = await db.shippingAddress.findMany({
      where: {
        userId: address.userId,
      },
    })
  } catch {
    return null
  }

  // then see if there's an addresses that matches the one that is passed in
  const matchingAddress = addresses.find((address) => {
    return (
      address.recipientName === address.recipientName &&
      address.addressLine1 === address.addressLine1 &&
      address.addressLine2 === address.addressLine2 &&
      address.city === address.city &&
      address.state === address.state &&
      address.zipCode === address.zipCode &&
      address.countryCode === address.countryCode
    )
  })

  if (matchingAddress) {
    return matchingAddress
  } else {
    return null
  }
}
