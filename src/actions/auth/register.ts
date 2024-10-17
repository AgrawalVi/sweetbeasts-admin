'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

import { RegisterSchema } from '@/schemas'
import { getUserByEmail } from '@/data/auth/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid Fields' }
  }

  const { email, password, firstName, lastName } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  // make sure email is not taken
  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: 'Account already exists, please Login!' }
  }

  const stripeCustomer = await stripe.customers.create({
    email,
    name: `${firstName} ${lastName}`,
  })

  await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      stripeCustomerId: stripeCustomer.id,
    },
  })

  const verificationToken = await generateVerificationToken(email)
  console.log('verificationToken', verificationToken)

  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: 'Confirmation email sent!' }
}
