'use server'

import * as z from 'zod'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { CreateProductSchema } from '@/schemas'
import { getProductByName } from '@/data/admin/products'
import { currentRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export const createProduct = async (
  values: z.infer<typeof CreateProductSchema>,
) => {
  // THIS IS AN ADMIN ONLY ACTION
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    return {
      error:
        'You are not authorized to create a product. Please contact an admin for the necessary permissions.',
    }
  }

  const validatedFields = CreateProductSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name, quantity, priceInCents, description, available } =
    validatedFields.data

  const existingProduct = await getProductByName(name)

  if (existingProduct) {
    return { error: 'Product with this name already exists' }
  }

  // create the product in stripe
  let stripeProduct = null
  try {
    stripeProduct = await stripe.products.create({
      name,
      description,
      active: available === 'true',
      shippable: true,
      // make sure there's no spaces in the url
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${name.split(' ').join('-')}`,
      default_price_data: {
        currency: 'usd',
        unit_amount: priceInCents,
      },
    })
  } catch {
    return { error: 'Failed to create product in stripe' }
  }

  if (!stripeProduct) {
    return { error: 'Failed to create product in stripe' }
  }

  // transaction to create the product and its variants
  let rootProduct, variant, price
  try {
    await db.$transaction(async (tx) => {
      rootProduct = await tx.product.create({
        data: {
          name,
          description,
        },
      })
      variant = await tx.productVariant.create({
        data: {
          variantProductName: name,
          variantDescription: description,
          inventory: quantity,
          stripeProductId: stripeProduct.id,
          parentProductId: rootProduct.id,
          priceInCents,
          stripePriceId: stripeProduct.default_price as string,
          primaryVariant: true,
        },
      })
    })
  } catch (e) {
    console.log(e)
    return { error: 'Failed to create product' }
  }

  return { success: 'Product created successfully' }
}
