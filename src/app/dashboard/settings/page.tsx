"use client"

import { logout } from "@/actions/auth/logout"
import { signOut } from "next-auth/react"
import { useCurrentUser } from "@/hooks/use-current-user"

const SettingsPage = () => {
  const user = useCurrentUser()

  const onClick = () => {
    signOut()
  }

  return (
    <main className="flex w-full h-full items-center justify-center">
      <button className="bg-white p-10 rounded-xl " onClick={onClick}>Sign Out</button>
    </main>
  )
}

export default SettingsPage
