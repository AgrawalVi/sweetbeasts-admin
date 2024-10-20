import * as z from 'zod'

// AUTH SCHEMAS

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .email({
      message: 'Please enter a valid email address',
    }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string()),
})

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, {
        message: 'Email is required',
      })
      .email({
        message: 'Please enter a valid email address',
      }),
    password: z.string().min(8, {
      message: 'Minimum 8 characters required',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Minimum 8 characters required',
    }),
    firstName: z.string().min(1, {
      message: 'First name is required',
    }),
    lastName: z.string().min(1, {
      message: 'Last name is required',
    }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword
    },
    {
      message: 'Passwords do not match!',
      path: ['confirmPassword'],
    },
  )

export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .email({
      message: 'Please enter a valid email address',
    }),
})

export const NewPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: 'Minimum 8 characters required',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Minimum 8 characters required',
    }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword
    },
    {
      message: 'Passwords do not match!',
      path: ['confirmPassword'],
    },
  )

// ADMIN PORTAL SCHEMAS

export const RootProductSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
})

export const ProductVariantSchema = z.object({
  variantProductName: z
    .string()
    .min(1, { message: 'Please name the product variant' }),
  variantKey: z
    .string()
    .min(1, { message: 'Add a key for the product variant' }),
  description: z
    .string()
    .min(1, { message: 'Add a description for the product variant' }),
  priceInCents: z.coerce
    .number({
      message: 'Price must be a number',
    })
    .gte(99, {
      message: 'Price has to be greater than $0.99',
    }),
  quantity: z.coerce.number({
    message: 'Quantity must be a number',
  }),
  available: z.enum(['true', 'false'], {
    message: 'Available must be a boolean',
  }),
})

export const CreateProductSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
  priceInCents: z.coerce
    .number({
      message: 'Price must be a number',
    })
    .gte(0, {
      message: 'Price has to be greater or equal to than 0',
    }),
  quantity: z.coerce.number({
    message: 'Quantity must be a number',
  }),
  available: z.enum(['true', 'false'], {
    message: 'Available must be a boolean',
  }),
})
