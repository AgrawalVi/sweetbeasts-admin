import { CardWrapper } from '@/components/auth/card-wrapper'
import { TriangleAlert } from 'lucide-react'

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Opps! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        <TriangleAlert className="text-destructive"></TriangleAlert>
      </div>
    </CardWrapper>
  )
}
