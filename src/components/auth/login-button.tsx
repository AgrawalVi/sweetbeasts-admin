"use client"

import Link from "next/link"

interface LoginButtonProps {
  children: React.ReactNode
  mode?: "modal" | "redirect"
  asChild?: boolean
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {

  if (mode === "modal") {
    return <span>TODO: IMPLEMENT MODAL</span>
  }

  return (
      <Link href="/auth/login">{children}</Link>
  )
}
