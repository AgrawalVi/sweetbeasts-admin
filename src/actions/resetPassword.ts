'use server'

import * as z from "zod"

import { ResetPasswordSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { sendResetPasswordEmail } from "@/lib/mail"
import { generateResetPasswordToken } from "@/lib/tokens"

export const resetPassword = async (values: z.infer<typeof ResetPasswordSchema>) => {
  const validatedFields = ResetPasswordSchema.safeParse(values);
  
  if (!validatedFields.success) {
    return {
      error: "Not a valid email!",
    }
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      success: "Reset email sent!",
    }
  }

  const resetPasswordToken = await generateResetPasswordToken(email);
  await sendResetPasswordEmail(resetPasswordToken.email, resetPasswordToken.token)

  return { success: "Reset email sent!"}
}
