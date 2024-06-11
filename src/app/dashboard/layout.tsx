import Header from "@/components/general/header";

export default function Layout({children}: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col h-full">
      <Header/>
      <div className="p-4 md:p-8 h-full">
        {children}
      </div>
    </div>
  )
}
