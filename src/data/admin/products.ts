import { db } from "@/lib/db"

export async function getProductByName(name: string) {
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

export async function getProductById(id: number) {
  try {
    const product = await db.product.findUnique({
      where: {
        id,
      },
    })
    return product
  } catch {
    return null
  }
}
