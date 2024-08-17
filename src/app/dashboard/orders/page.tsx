import { currentUser } from '@/lib/auth'
import { getAllOrdersWithData } from '@/data/admin/orders'
import { orderTableColumns } from '@/components/admin/orders/table/columns'
import { OrdersDataTable } from '@/components/admin/orders/table/data-table'

export default async function Orders() {
  const orders = await getAllOrdersWithData()

  if (!orders || orders.length === 0) {
    return null
  }

  return <OrdersDataTable columns={orderTableColumns} data={orders} />
}
