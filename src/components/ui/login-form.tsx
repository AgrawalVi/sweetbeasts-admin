import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginForm() {
  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>SweetBeasts Admin</CardTitle>
        <CardDescription>If you do not have login information, please contact an administrator</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div>
            <Label htmlFor="email">Name</Label>
            <Input id="email" placeholder="Enter your email" />
            <Label htmlFor="password">Password</Label>
            <Input id="password" type='password' placeholder="Enter your password" />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}