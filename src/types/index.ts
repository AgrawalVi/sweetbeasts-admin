import { Product, ProductVariant } from '@prisma/client'

export type ProductWithData = Product & {
  variants: ProductVariant[]
}
