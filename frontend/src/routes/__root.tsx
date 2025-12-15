import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { AuthContext } from '@/contexts/AuthProvider'

interface MyRouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Outlet />,
})  
