'use client'

import CreateProductButton from '@/components/admin/products/create-product-button'
import ProductTable from '@/components/admin/products/product-table'
import EditProductButton from '@/components/admin/products/edit-product-button'

export default function Products() {
  return (
    <>
      <CreateProductButton />
      <EditProductButton />
      <ProductTable />
    </>
  )
}
