'use server'

import { getAllProducts as getAllProductsDb } from '@/data/admin/products'
import { currentRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { getProductById as getProductByIdDb } from '@/data/admin/products'

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


export const getProductById = async (id:number) => {
  // THIS IS AN ADMIN ONLY ACTION
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    return {
      error:
        'You are not authorized to edit a product. Please contact an admin for the necessary permissions.',
    }
  }

  try {
    const products = await getProductByIdDb(id)
    if (!products) {
      return { error: 'No products found' }
    }
    console.log('products', products)
    return { success: products }
  } catch {
    return { error: 'Error getting products' }
  }
}