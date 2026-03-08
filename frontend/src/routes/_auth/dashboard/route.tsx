import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Sidebar'
import Header from '@/components/Header'

export const Route = createFileRoute('/_auth/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <div className="w-full overflow-hidden">
          <Header />
          <main className="p-5 md:p-10 h-full">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </>
  )
}
