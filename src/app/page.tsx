import Image from 'next/image'
import { LoginButton } from '@/components/auth/login-button'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-200 to-rose-500">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold text-white drop-shadow-lg">
          Welcome to
        </h1>
        <h1 className="text-6xl font-semibold text-white drop-shadow-lg">
          SweetBeasts Admin
        </h1>
        <p className="text-2xl font-semibold text-white drop-shadow-lg">
          If you have an admin account, please login below
        </p>
        <LoginButton>
          <Button
            size="lg"
            className="mt-5 bg-white text-lg text-black hover:bg-white/80"
          >
            Sign in
          </Button>
        </LoginButton>
      </div>
    </main>
  )
}
