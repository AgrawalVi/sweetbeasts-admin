'use client'

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { OrderWithData } from '@/types'
import { shipOrder } from '@/actions/orders/ship-order'

interface OrdersDataTableProps {
  columns: ColumnDef<OrderWithData>[]
  data: OrderWithData[]
}

export function OrdersDataTable({ columns, data }: OrdersDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const shipOrderButton = async () => {
    console.log('shipping order')
    shipOrder(1, 1, {
      height: '10',
      width: '10',
      length: '10',
      distanceUnit: 'in',
      massUnit: 'lb',
      weight: '3',
    })
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex w-full justify-center">
      <Button onClick={shipOrderButton}>Ship Order</Button>
      <div className="flex max-w-screen-2xl flex-col items-start gap-4 p-5 lg:grid lg:grid-cols-5 xl:grid-cols-3">
        <div className="w-full space-y-2 lg:col-span-3 xl:col-span-2">
          <div className="flex w-full items-end justify-between gap-2">
            <div className="flex flex-1 flex-col-reverse items-start gap-2 md:flex-row">
              <Input
                placeholder="Search Customer..."
                value={
                  (table.getColumn('customer')?.getFilterValue() as string) ??
                  ''
                }
                onChange={(event) =>
                  table
                    .getColumn('customer')
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              {/*{table.getColumn('applicationStatus') && (*/}
              {/*  <DataTableFacetedFilter*/}
              {/*    column={table.getColumn('applicationStatus')}*/}
              {/*    title="Application Status"*/}
              {/*    options={dataTableApplicationStatusOptions}*/}
              {/*  />*/}
              {/*)}*/}
            </div>
          </div>
          <div className="rounded-md border">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      // className={cn(
                      //   'cursor-pointer',
                      //   row.original.id === selectedRow?.id && 'bg-muted',
                      // )}
                      // onClick={() => setSelectedRow(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  )
}
