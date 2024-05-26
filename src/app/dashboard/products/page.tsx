"use client"

import { admin } from "@/actions/admin"
import { RoleGate } from "@/components/auth/role-gate"
import { Button } from "@/components/ui/button"
import { useCurrentRole } from "@/hooks/use-current-role"
import { UserRole } from "@prisma/client"

export default function Products() {
  const currentRole = useCurrentRole()

  const onAPIRouteClick = async () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        console.log("OK")
      }
      else {
        console.log("forbidden")
      }
    })
  }

  const onServerActionClick = async() => {
    const result = await admin()
    if (result.success) {
      console.log("OK")
    }
    else {
      console.log("forbidden")
    }
  }

  return (
    <>
      <div>Current Role: {currentRole}</div>
      <RoleGate allowedRoles={[UserRole.ADMIN]}>
        <div>Admin View</div>
      </RoleGate>
      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
        Admin only api route
        <Button onClick={onAPIRouteClick}>Click to test</Button>
      </div>
      <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
        Admin only server action
        <Button onClick={onServerActionClick}>Click to test</Button>
      </div>
    </>
  )
}
