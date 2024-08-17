'use server'

import {
  getAllProducts as getAllProductsDb,
  getProductById as getProductByIdDb,
} from '@/data/admin/products'
import { currentRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export const getAllProducts = async () => {
  // THIS IS AN ADMIN ONLY ACTION
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    return {
      error:
        'You are not authorized to complete this action. Please contact an admin for the necessary permissions.',
    }
  }

  try {
    const products = await getAllProductsDb()
    if (!products) {
      return { error: 'No products found' }
    }
    return { success: products }
  } catch (e) {
    return { error: 'Error: ' + e }
  }
}

export const getProductById = async (id: number) => {
  // THIS IS AN ADMIN ONLY ACTION
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    return {
      error:
        'You are not authorized to complete this action. Please contact an admin for the necessary permissions.',
    }
  }

  try {
    const product = await getProductByIdDb(id)
    if (!product) {
      return { error: 'No product found' }
    }
    console.log('product', product)
    return { success: product }
  } catch (e) {
    return { error: 'Error: ' + e }
  }
}
