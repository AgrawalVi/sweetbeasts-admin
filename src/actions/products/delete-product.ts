'use server'

import { db } from '@/lib/db'
import { currentRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { getProductVariantById } from '@/data/admin/products'

export const deleteProduct = async (productId: number) => {
  // THIS IS AN ADMIN ONLY ACTION
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    return {
      error:
        'You are not authorized to delete a product. Please contact an admin for the necessary permissions.',
    }
  }

  console.log(productId)

  const existingProduct = await getProductVariantById(productId)

  if (!existingProduct) {
    return { error: 'Product not found' }
  }

  try {
    // Delete related cart items
    await db.cartItem.deleteMany({
      where: { productId: existingProduct.id },
    })

    // Delete the product
    await db.product.delete({
      where: { id: existingProduct.id },
    })
  } catch (e) {
    console.log(e)
    return { error: 'Failed to delete product' }
  }

  return { success: 'Product deleted successfully' }
}
