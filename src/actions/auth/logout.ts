'use server'

import { signOut } from '@/auth'

export const logout = async () => {
  // some server stuff to do before logging out
  await signOut()
}
