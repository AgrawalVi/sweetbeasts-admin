'use server'

import * as z from 'zod'

import bcrypt from 'bcryptjs'
import { NewPasswordSchema } from '@/schemas'
import { getPasswordResetTokenByToken } from '@/data/auth/reset-password-token'
import { getUserByEmail } from '@/data/auth/user'
import { db } from '@/lib/db'

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { error: 'Missing Token' }
  }

  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { password } = validatedFields.data

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    return { error: 'Invalid Token' }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: 'Token has expired' }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return { error: 'User not found' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  })

  await db.resetPasswordToken.delete({
    where: { id: existingToken.id },
  })

  return { success: 'Password updated' }
}
