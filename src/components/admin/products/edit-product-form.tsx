import React, { useEffect } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createProduct } from '@/actions/products/create-product'
import { editProduct } from '@/actions/products/edit-product'
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

import { useMutation, useQueryClient } from '@tanstack/react-query'
import Products from '@/app/dashboard/products/page'
import { getProductById } from '@/actions/products/get-product'
import { Product } from '@prisma/client'
import result from 'postcss/lib/result'

interface EditProductFormProps {}

export default function EditProductForm({}: EditProductFormProps) {
  console.log('called editproductform')
  const { toast } = useToast()
  const productId = 2
  const [product, setProduct] = React.useState<Product | null>(null)

  useEffect(() => {
    getProductById(productId).then((result) => {
      if (result.success) {
        toast({
          title: 'Product fetched',
          description: `Product fetched successfully`,
        })
        setProduct(result.success)
      }
      if (result.error) {
        toast({
          title: 'An error has occurred',
          description: result.error,
          variant: 'destructive',
        })
      }
    })
  }, [productId])
  //
  const form = useForm<z.infer<typeof CreateProductSchema>>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: product?.name,
      description: product?.description,
      priceInCents: product?.priceInCents,
      quantity: product?.inventory,
      available: product?.available ? 'true' : 'false',
    },
    values: {
      name: product!.name,
      description: product!.description,
      priceInCents: product!.priceInCents,
      quantity: product!.inventory,
      available: product!.available ? 'true' : 'false',
    },
  })

  async function onSubmit(values: z.infer<typeof CreateProductSchema>) {
    let result = await createProduct(values)

    if (result.success) {
      toast({
        title: 'Product added',
        description: `${values.name} added successfully`,
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
                <Input placeholder="beast" {...field} />
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
                <Input placeholder="very beastly" {...field} />
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
                  <Input placeholder="100" type="number" {...field} />
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
                  <Input placeholder="5" type="number" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={'false'}>
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
        {/* <FormField */}
        <Button type="submit">Add Product</Button>
      </form>
    </Form>
  )
}
