import Header from "@/components/custom/header";

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header/>
      <div className="p-4 md:p-8">
        {children}
      </div>
    </div>
  )
}