'use client'

import { admin } from '@/actions/auth/admin'
import { RoleGate } from '@/components/auth/role-gate'
import { Button } from '@/components/ui/button'
import { useCurrentRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import CreateProductForm from '@/components/admin/create-product-form'

export default function Products() {
  const currentRole = useCurrentRole()

  return (
    <>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button> Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Add Product</DialogHeader>
            <DialogDescription>
              Fill out the form to add a product
            </DialogDescription>
            <CreateProductForm />
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
