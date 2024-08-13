'use client'

import { ColumnDef } from '@tanstack/react-table'
import format from 'date-fns'
import { Button } from '@/components/ui/button'
import { OrderWithData } from '@/types'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'

export const orderTableColumns: ColumnDef<OrderWithData>[] = [
  {
    accessorKey: 'ShippingAddress.recipientName',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Customer" />
    }
  },
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Order Number" />
    }
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />
    }
  },
]