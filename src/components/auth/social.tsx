'use client'

import { IconBrandGoogle, IconBrandDiscord } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const Social = ({
  googleButtonText = 'Sign in with Google',
}: {
  googleButtonText: string | undefined
}) => {
  const onClick = (provider: 'google' | 'discord') => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
  }

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size="lg"
        className="relative w-full"
        variant="outline"
        onClick={() => {
          onClick('google')
        }}
      >
        {googleButtonText}
        <IconBrandGoogle className="absolute left-5 h-5 w-5" />
      </Button>
    </div>
  )
}
