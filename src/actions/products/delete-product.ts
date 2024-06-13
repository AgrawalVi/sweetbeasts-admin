'use server'

import * as z from 'zod'
import { db } from '@/lib/db'
import { currentRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { getProductByName } from '@/data/admin/products'

// Define the schema for product deletion
const DeleteProductSchema = z.object({
  name: z.string(),
})

export const deleteProduct = async (
  values: z.infer<typeof DeleteProductSchema>,
) => {
  // THIS IS AN ADMIN ONLY ACTION
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    return {
      error:
        'You are not authorized to delete a product. Please contact an admin for the necessary permissions.',
    }
  }

  console.log(values)
  const validatedFields = DeleteProductSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name } = validatedFields.data

  const existingProduct = await getProductByName(name)

  if (!existingProduct) {
    return { error: 'Product not found' }
  }

  try {
    await db.$transaction(async (prisma) => {
      // Delete related cart items
      await prisma.cartItem.deleteMany({
        where: { productId: existingProduct.id },
      })
      // Delete the product
      await prisma.product.delete({
        where: { name },
      })
    })
  } catch (e) {
    console.log(e)
    return { error: 'Failed to delete product' }
  }

  return { success: 'Product deleted successfully' }
}
