import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required"
  }).email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(1, {
      message: "Password is required"
    }
  )
});

export const RegisterSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required"
  }).email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(8, {
    message: "Minimum 8 characters required"
  }),
  confirmPassword: z.string().min(8, {
    message: "Minimum 8 characters required"
  }),
  firstName: z.string().min(1, {
    message: "First name is required"
  }),
  lastName: z.string().min(1, {
    message: "Last name is required"
  })

}).refine((data) => {
  return data.password === data.confirmPassword
},
  {
    message: "Passwords do not match!",
    path: ['confirmPassword']
  }
)