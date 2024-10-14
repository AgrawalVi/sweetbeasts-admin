'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { OrderWithData } from '@/types'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'

export const orderTableColumns: ColumnDef<OrderWithData>[] = [
  {
    accessorFn: (row) => [row.shippingAddress.recipientName, row.email],
    id: 'customer',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Customer" />
    },
    cell: ({ row }) => {
      const [name, email] = row.getValue('customer') as string[]
      return (
        <div>
          <p>{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const [name, email] = row.getValue('customer') as string[]
      const string = `${name} ${email}`
      return string.includes(value)
    },
  },
  {
    accessorKey: 'orderNumber',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Order Number" />
    },
  },
  {
    accessorKey: 'orderStatus',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Date" />
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return <div>{format(new Date(date), 'PPP')}</div>
    },
  },
]
