'use server'

import { shippo } from '@/lib/shippo'
import { currentRole } from '@/lib/auth'
import { OrderWithData } from '@/types'
import { getOrderWithDataById } from '@/data/admin/orders'
import { getFromAddressById } from '@/data/admin/from-address'
import {
  LabelFileTypeEnum,
  ParcelCreateRequest,
  ServiceLevelUPSEnum,
} from 'shippo'
import { fromAddressEmail } from '@/constants'
import { shipOrder as shipOrderDb } from '@/data/admin/orders'

const UPSKey = process.env.SHIPPO_UPS_KEY!

export const shipOrder = async (
  orderId: number,
  fromAddressId: number,
  parcel: ParcelCreateRequest,
) => {
  const role = await currentRole()

  if (role !== 'ADMIN') {
    return {
      error: 'You are not authorized to ship this order',
    }
  }

  const order: OrderWithData | null = await getOrderWithDataById(orderId)
  const fromAddress = await getFromAddressById(fromAddressId)

  if (!order) {
    return {
      error: 'Order not found',
    }
  }

  if (!fromAddress || !fromAddress.shippingAddress) {
    return {
      error: 'From address not found',
    }
  }

  const toAddress = order.shippingAddress

  let shipment
  try {
    shipment = await shippo.shipments.create({
      addressFrom: {
        name: fromAddress.shippingAddress.recipientName ?? undefined,
        street1: fromAddress.shippingAddress.addressLine1 ?? undefined,
        street2: fromAddress.shippingAddress.addressLine2 ?? undefined,
        city: fromAddress.shippingAddress.city ?? undefined,
        state: fromAddress.shippingAddress.state ?? undefined,
        zip: fromAddress.shippingAddress.zipCode ?? undefined,
        country: 'US',
        email: fromAddressEmail,
        phone: '4145301248',
      },
      addressTo: {
        name: toAddress.recipientName ?? undefined,
        street1: toAddress.addressLine1 ?? undefined,
        street2: toAddress.addressLine2 ?? undefined,
        city: toAddress.city ?? undefined,
        state: toAddress.state ?? undefined,
        zip: toAddress.zipCode ?? undefined,
        country: toAddress.countryCode as string,
        email: order.email,
      },
      parcels: [parcel],
    })
  } catch (e) {
    console.log(e)
    return {
      error: 'Error occurred while creating shipment',
    }
  }

  // console.log('shipment', shipment)

  if (!shipment) {
    return {
      error: 'Failed to ship order',
    }
  }

  // console.log('shipment', shipment)
  // find the correct rate
  const rate = shipment.rates.find((rate) => {
    return order.shippingMethod === 'STANDARD'
      ? rate.servicelevel.token === ServiceLevelUPSEnum.UpsGround.valueOf()
      : rate.servicelevel.token ===
          ServiceLevelUPSEnum.UpsSecondDayAir.valueOf()
  })

  if (!rate) {
    return {
      error: 'Failed to find rate',
    }
  }

  console.log(rate)

  let transaction
  try {
    transaction = await shippo.transactions.create({
      rate: rate.objectId,
      labelFileType: LabelFileTypeEnum.Pdf,
      async: false,
    })
  } catch (e) {
    console.log(e)
    return {
      error: 'Error occurred while creating transaction',
    }
  }

  if (!transaction || transaction.status !== 'SUCCESS') {
    return {
      error: 'Failed to create transaction',
    }
  }

  console.log('transaction', transaction)

  // TODO: Update order with data
  const shippedOrder = await shipOrderDb(
    orderId,
    transaction.objectId,
    transaction.labelUrl,
    rate.provider,
    rate.servicelevel.name,
    transaction.trackingNumber,
    transaction.trackingUrlProvider,
  )

  if (!shippedOrder) {
    return {
      error: 'Failed to update with tracking information',
    }
  }

  // TODO: send email to customer
}
