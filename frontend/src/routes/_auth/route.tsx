import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      toast.error('Please log in')
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
  return <Outlet />
}
