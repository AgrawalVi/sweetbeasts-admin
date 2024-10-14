import React, { useEffect } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { editProduct } from '@/actions/products/edit-product' // Import the function here
import { CreateProductSchema } from '@/schemas'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Product, ProductVariant } from '@prisma/client'
import { ProductWithData } from '@/types'

interface EditProductFormProps {
  product: ProductVariant
  setIsChanged: (value: boolean) => void
  setOpen: (value: boolean) => void
}

export default function EditProductForm({
  product,
  setIsChanged,
  setOpen,
}: EditProductFormProps) {
  const { toast } = useToast()

  const defaultValues = {
    name: product.variantProductName,
    description: product.variantDescription,
    priceInCents: product.priceInCents,
    quantity: product.inventory,
    available: product.available ? 'true' : 'false',
  }

  const form = useForm<z.infer<typeof CreateProductSchema>>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: product.variantProductName,
      description: product.variantDescription ?? undefined,
      priceInCents: product.priceInCents,
      quantity: product.inventory,
      available: product.available ? 'true' : 'false',
    },
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log(JSON.stringify(value))
      console.log(JSON.stringify(defaultValues))
      const hasChanged = JSON.stringify(value) !== JSON.stringify(defaultValues)
      setIsChanged(hasChanged)
    })

    return () => subscription.unsubscribe()
  }, [form, setIsChanged])

  async function onSubmit(values: z.infer<typeof CreateProductSchema>) {
    let result = await editProduct(values, product.id) // Correct order of parameters

    if (result.success) {
      toast({
        title: 'Product edited',
        description: `${values.name} edited successfully`,
      })
    }
    if (result.error) {
      toast({
        title: 'An error has occurred',
        description: result.error,
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Product Name" {...field} />
              </FormControl>
              <FormDescription>Enter the name of the product</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Input placeholder="Product Description" {...field} />
              </FormControl>
              <FormDescription>
                Enter a short description of the product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-x-2">
          <FormField
            control={form.control}
            name="priceInCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Price in cents"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the price of the product, in cents
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input placeholder="Quantity" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the initial quantity of the product to make available
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={product.available ? 'true' : 'false'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select if the product is available" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select if the product is available for purchase
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Edit Product</Button>
      </form>
    </Form>
  )
}
