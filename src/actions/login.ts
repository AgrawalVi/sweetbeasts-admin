'use server'

import * as z from "zod"
import { LoginSchema } from "@/schemas"


export const register = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "invalid fields" };
  }
  return { success: "Email sent!" }
}