import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CreateProductSchema } from "@/schemas"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export default function CreateProductForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof CreateProductSchema>>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      priceInCents: 0,
    },
  })

  function onSubmit(values: z.infer<typeof CreateProductSchema>) {
    toast({
      title: "product added",
      description: `Product ${values.name} with description ${values.description} and price ${values.priceInCents} added successfully`,
    })
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
              <FormDescription>Enter a short description of the product</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priceInCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="100" type='number' {...field} />
              </FormControl>
              <FormDescription>Enter the price of the product, in cents</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Add Product</Button>
      </form>
    </Form>
  )
}
