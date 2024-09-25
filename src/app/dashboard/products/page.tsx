import CreateProductButton from '@/components/admin/products/create-product-button'
import ProductTable from '@/components/admin/products/product-table'
import { getAllProducts } from '@/data/admin/products'
import { ProductWithData } from '@/types'

export default async function Products() {
  const products: ProductWithData[] | null = await getAllProducts()

  return (
    <>
      <CreateProductButton />
      <ProductTable products={products} />
    </>
  )
}
