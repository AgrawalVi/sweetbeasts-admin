import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import CreateProductForm from './create-product-form'

import { useState } from 'react'

const CreateProductButton = () => {
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
      <Dialog open={mainOpen} onOpenChange={setMainOpen}>
        <DialogTrigger asChild>
          <Button>Add Product</Button>
        </DialogTrigger>
        <DialogContent onEscapeKeyDown={onExit} onInteractOutside={onExit}>
          <DialogHeader>Add Product</DialogHeader>
          <DialogDescription>
            Fill out the form to add a product
          </DialogDescription>
          <CreateProductForm
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

export default CreateProductButton
