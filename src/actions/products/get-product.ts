'use server'

import { getAllProducts as getAllProductsDb } from '@/data/admin/products'

export const getAllProducts = async () => {
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
