'use client'

import { logout } from '@/actions/auth/logout'
import { signOut } from 'next-auth/react'
import { useCurrentUser } from '@/hooks/use-current-user'

const SettingsPage = () => {
  const user = useCurrentUser()

  const onClick = () => {
    signOut()
  }

  return (
    <main className="flex h-full w-full items-center justify-center">
      <button className="rounded-xl bg-white p-10" onClick={onClick}>
        Sign Out
      </button>
    </main>
  )
}

export default SettingsPage
