import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from "react";

export default function LoginForm() {

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>SweetBeasts Admin</CardTitle>
        <CardDescription>Login below. If you forgot your login information contact an administrator</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email" />
          </div>
          <div className="justify-center">
            <Button type="submit">SignIn with Resend</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}