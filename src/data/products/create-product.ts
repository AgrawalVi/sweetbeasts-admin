import { db } from "@/lib/db";

export const createProduct = async (values : { name: string, description: string, price: number }) => {
  try {
    const product = await db.product.create({
      data: {
        name: values.name,
        description: values.description,
        priceInCents: values.price
      }
    })
  }
}