'use server'

import * as z from 'zod'

import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { CreateProductSchema } from '@/schemas'
import { getProductByName } from '@/data/admin/products'
import { currentRole } from '@/lib/auth'

export const createProduct = async (
  values: z.infer<typeof CreateProductSchema>,
) => {

  // THIS IS AN ADMIN ONLY ACTION
  const role = await currentRole()
  if (role !== 'ADMIN') {
    return { error: 'You are not authorized to create a product. Please contact an admin for the necessary permissions.' }
  }

  console.log(values)
  const validatedFields = CreateProductSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name, quantity, priceInCents, description } = validatedFields.data

  const existingProduct = await getProductByName(name)

  if (existingProduct) {
    return { error: 'Product with this name already exists' }
  }

  let stripeProduct = null
  try {
    stripeProduct = await stripe.products.create({
      name,
      description,
      shippable: true,
      url: `https://sweetbeasts.shop/products/${name}`,
      default_price_data: {
        currency: 'usd',
        unit_amount: priceInCents,
      },
    })
  } catch {
    return { error: 'Failed to create product in stripe' }
  }
  console.log('stripeProduct', stripeProduct)

  if (stripeProduct) {
    try {
      await db.product.create({
        data: {
          name,
          description,
          priceInCents,
          inventory: quantity,
          stripeProductId: stripeProduct.id,
          stripePriceId: stripeProduct.default_price as string,
        },
      })
    } catch (e) {
      console.log(e)
      return { error: 'Failed to create product' }
    }
  }

  return { success: 'Product created successfully' }
}
