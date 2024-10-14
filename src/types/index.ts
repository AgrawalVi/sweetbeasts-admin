import {
  GuestUser,
  LineItem,
  Order,
  Product,
  ShippingAddress,
  ProductVariant
} from '@prisma/client'

export type LineItemWithProduct = LineItem & {
  productVariant: ProductVariant & { parentProduct: Product }
}

export type GuestUserWithData = GuestUser & {
  shippingAddresses: ShippingAddress[]
  orders: Order[]
}

export type stripeLineItemWithProductId = {
  price: string
  quantity: number
  id: number
}

export type OrderWithData = Order & {
  lineItems: LineItemWithProduct[] | null
} & {
  shippingAddress: ShippingAddress
}

export type ProductWithData = Product & {
  variants: ProductVariant[]
}
