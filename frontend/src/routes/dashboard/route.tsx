import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AppSidebar } from '@/components/Sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import Header from '@/components/Header'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      toast.error('Please log in')
      toast.info(JSON.stringify(context.auth))
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AppLayoutComponent,
})

function AppLayoutComponent() {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <div className="w-full">
          <Header />
          <main className="p-3 md:p-10 h-full">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </>
  )
}
