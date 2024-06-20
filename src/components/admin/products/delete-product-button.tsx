import { Product } from '@prisma/client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { deleteProduct } from '@/actions/products/delete-product'

interface DeleteProductButtonProps {
  product: Product
}

const DeleteProductButton: React.FC<DeleteProductButtonProps> = ({ product }) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    const result = await deleteProduct(product.id)
    if (result.success) {
      toast({
        title: 'Product deleted',
        description: result.success,
      })
    } else {
      toast({
        title: 'An error occurred',
        description: result.error,
        variant: 'destructive',
      })
    }
    setConfirmDeleteOpen(false)
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setConfirmDeleteOpen(true)} className="h-8 w-8 p-0">
        <Trash className="h-4 w-4" />
      </Button>
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>Confirm Delete</DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogDescription>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DeleteProductButton
