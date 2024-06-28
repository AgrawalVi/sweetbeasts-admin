import { Product } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import EditProductForm from './edit-product-form'
import { useState } from 'react'
import { Pencil } from 'lucide-react'

interface EditProductButtonProps {
  product: Product
}

const EditProductButton: React.FC<EditProductButtonProps> = ({ product }) => {
  const [mainOpen, setMainOpen] = useState<boolean>(false)
  const [confirmExitOpen, setConfirmExitOpen] = useState<boolean>(false)
  const [isChanged, setIsChanged] = useState<boolean>(false)

  const onExit = (event: any) => {
    event.preventDefault() // prevent the default form closure
    if (isChanged) {
      setConfirmExitOpen(true)
    } else {
      setMainOpen(false)
    }
  }
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setMainOpen(true)}
        className="h-8 w-8 p-0"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Dialog open={mainOpen} onOpenChange={setMainOpen}>
        <DialogContent onEscapeKeyDown={onExit} onInteractOutside={onExit}>
          <DialogHeader>Edit Product</DialogHeader>
          <DialogDescription>
            Fill out the form to edit the product
          </DialogDescription>
          <EditProductForm
            product={product}
            setIsChanged={setIsChanged}
            setOpen={setMainOpen}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={confirmExitOpen} onOpenChange={setConfirmExitOpen}>
        <DialogContent className="w-[300px]">
          <DialogHeader>Are you sure you want to exit?</DialogHeader>
          <DialogDescription>
            This will exit the form and you will lose any unsaved changes.
          </DialogDescription>
          <div className="flex items-center justify-center gap-x-2">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setConfirmExitOpen(false)}
            >
              Go Back
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => {
                setConfirmExitOpen(false)
                setMainOpen(false)
              }}
            >
              Yes, Exit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditProductButton
