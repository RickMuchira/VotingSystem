"use client"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/ui/admin/admin-header"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <div className="flex flex-col flex-1 w-full">
          <AdminHeader />
          <main className="flex-1 w-full p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

