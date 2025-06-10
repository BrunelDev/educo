import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {Notifications} from "./components/notifications"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className="bg-[url(/workspace-bg.svg)] bg-no-repeat bg-cover bg-center w-full py-5 px-6 text-white-800 relative">
        <SidebarTrigger/>
          {children}
        
        <div className="fixed top-2 right-2 z-[999]"><Notifications/></div>
      </main>
    </SidebarProvider>
  )
}
