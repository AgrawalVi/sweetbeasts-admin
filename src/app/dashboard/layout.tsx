'use client'
import Header from '@/components/general/header'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

export default function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-full w-full flex-col">
        <Header />
        <div className="h-full p-4 md:p-8">{children}</div>
      </div>
    </QueryClientProvider>
  )
}
