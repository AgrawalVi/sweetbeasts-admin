'use server'

import { getAllProducts as getAllProductsDb } from '@/data/admin/products'
import { currentRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export const getAllProducts = async () => {
  // THIS IS AN ADMIN ONLY ACTION
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    return {
      error:
        'You are not authorized to create a product. Please contact an admin for the necessary permissions.',
    }
  }

  try {
    const products = await getAllProductsDb()
    if (!products) {
      return { error: 'No products found' }
    }
    console.log('products', products)
    return { success: products }
  } catch {
    return { error: 'Error getting products' }
  }
}
