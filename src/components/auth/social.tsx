'use client'

import { IconBrandGoogle, IconBrandInstagram } from "@tabler/icons-react"
import { Button } from "@/components/ui/button";

export const Social = ({}) => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <IconBrandGoogle className='h-5 w-5' />
      </Button>
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <IconBrandInstagram className='h-5 w-5' />
      </Button>
    </div>
  )
}