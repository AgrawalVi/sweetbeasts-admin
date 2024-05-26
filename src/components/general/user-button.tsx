import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CircleUser } from "lucide-react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import LogoutButton from "../auth/logout-button"

export default function UserButton() {
  const user = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user?.image || ""}
            className="hover:opacity-80 transition-all"
          />
          <AvatarFallback className="bg-secondary hover:opacity-80 transition-all text-secondary-foreground">
            <CircleUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
