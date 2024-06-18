'use client'

import CreateProductButton from '@/components/admin/products/create-product-button'
import ProductTable from '@/components/ui//data-table'

export default function Products() {
  return (
    <>
      <CreateProductButton />
      <ProductTable />
    </>
  )
}
