'use server'

import * as z from 'zod'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { CreateProductSchema } from '@/schemas'
import { currentRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { getProductVariantById } from '@/data/admin/products'

export const editProduct = async (
  values: z.infer<typeof CreateProductSchema>,
  productId: number,
) => {
  // THIS IS AN ADMIN ONLY ACTION
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    return {
      error:
        'You are not authorized to edit a product. Please contact an admin for the necessary permissions.',
    }
  }
  // verify that the fields are valid
  const validatedFields = CreateProductSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name, quantity, priceInCents, description, available } =
    validatedFields.data

  // verify that the product exists
  const existingProduct = await getProductVariantById(productId)

  if (!existingProduct) {
    return { error: 'Product not found' }
  }

  // update the price and product information in stripe if necessary
  // if the price is different, update the price in stripe
  if (existingProduct.priceInCents !== priceInCents) {
    try {
      await stripe.prices.update(existingProduct.stripePriceId, {
        currency_options: {
          usd: {
            unit_amount: priceInCents,
          },
        },
      })
    } catch {
      return { error: 'Failed to update price in stripe' }
    }
  }

  // update the product information in stripe if necessary
  try {
    await stripe.products.update(existingProduct.stripeProductId, {
      name,
      description,
      active: available === 'true' ? true : false,
    })
  } catch {
    return { error: 'Failed to update product in stripe' }
  }

  // update the product information in our database
  try {
    await db.productVariant.update({
      where: {
        id: productId,
      },
      data: {
        variantProductName: name,
        inventory: quantity,
        priceInCents: priceInCents,
        variantDescription: description,
        available: available === 'true' ? true : false,
      },
    })
  } catch {
    return { error: 'Failed to update product in database' }
  }

  return { success: 'Product updated successfully' }
}
