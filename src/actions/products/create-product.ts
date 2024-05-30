"use server"

import * as z from "zod"

import { db } from "@/lib/db"
import { CreateProductSchema } from "@/schemas"
import { getProductByName } from "@/data/admin/products"

export const createProduct = async (
  values: z.infer<typeof CreateProductSchema>
) => {
  console.log(values)
  const validatedFields = CreateProductSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { name, quantity, priceInCents, description } = validatedFields.data

  const existingProduct = await getProductByName(name)

  if (existingProduct) {
    return { error: "Product with this name already exists" }
  }

  await db.product.create({
    data: {
      name,
      description, 
      priceInCents,
      quantity
    }
  })
  return { success: "Product created" }
}
