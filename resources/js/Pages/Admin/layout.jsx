"use client"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/ui/admin/admin-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div
        className="flex min-h-screen overflow-hidden bg-background"
        style={{ "--sidebar-width": "12rem", "--sidebar-width-icon": "3rem" }}
      >
        <AdminSidebar />
        <SidebarInset className="flex flex-col w-full">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="w-full">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

