import Header from '@/components/general/header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col">
      <Header />
      <div className="h-full p-4 md:p-8">{children}</div>
    </div>
  )
}
