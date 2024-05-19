'use server'

import * as z from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

import { RegisterSchema } from "@/schemas"
import { getUserByEmail } from "@/businessLogic/user"



export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { email, password, firstName, lastName} = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // make sure email is not taken
  const existingUser = await getUserByEmail(email);
  
  if (existingUser) {
    return { error: "Email already taken!" };
  }

  await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }
  })

  // TODO: SEND VERIFICATION TOKEN EMAIL

  return { success: "User created!" }
}