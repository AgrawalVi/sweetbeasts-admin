"use client"

import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import ThemeSwitcher from "@/components/ui/theme-switcher"
import { useState } from "react"
import { signOut } from "@/auth"
import LogoutButton from "../auth/logout-button"
import UserButton from "./user-button"

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
    },
    {
      name: "Products",
      path: "/dashboard/products",
    },
    {
      name: "Customers",
      path: "/dashboard/customers",
    },
    {
      name: "Analytics",
      path: "/dashboard/analytics",
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
    },
  ]

  return (
    <div className="sticky top-0 flex h-16 lg:h-20 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav
        className={cn(
          "hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
        )}
      >
        <Link
          href="/home"
          className="flex items-center gap-2 lg:text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
        </Link>
        {navItems.map((item, i) => (
          <Link
            href={item.path}
            key={i}
            className={cn(
              "transition-colors lg:text-lg hover:text-foreground",
              item.path === pathname
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/home"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            {navItems.map((item, i) => (
              <div className="flex" key={i}>
                <div onClick={() => setOpen(false)} className="shrink">
                  <Link
                    href={item.path}
                    className={cn(
                      "transition-colors lg:text-lg hover:text-foreground",
                      item.path === pathname
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                </div>
                <div className="grow"></div>
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <ThemeSwitcher />
        <UserButton />
      </div>
    </div>
  )
}
