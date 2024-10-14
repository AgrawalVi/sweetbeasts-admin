import 'server-only'

import { db } from '@/lib/db'

export async function getRootProductWithVariantsByName(name: string) {
  try {
    const product = await db.product.findFirst({
      where: {
        name: name,
      },
    })
    return product
  } catch {
    return null
  }
}

export async function getRootProductWithVariantsById(id: number) {
  try {
    return await db.product.findUnique({
      where: {
        id,
      },
      include: {
        variants: true,
      },
    })
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function getPrimaryProductVariantByRootProductId(id: number) {
  try {
    return await db.productVariant.findFirst({
      where: {
        parentProductId: id,
        primaryVariant: true,
      },
      include: {
        parentProduct: true,
      },
    })
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function getProductVariantById(id: number) {
  try {
    return await db.productVariant.findUnique({
      where: {
        id,
      },
    })
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function getAllProducts() {
  try {
    const products = await db.product.findMany({
      include: {
        variants: true,
      },
    })
    return products
  } catch {
    return null
  }
}

export async function getProductVariantByStripePriceId(
  stripePriceId: string | undefined | null,
) {
  if (!stripePriceId) {
    return null
  }
  try {
    return await db.productVariant.findUnique({
      where: {
        stripePriceId,
      },
      include: {
        parentProduct: true,
      },
    })
  } catch {
    return null
  }
}
