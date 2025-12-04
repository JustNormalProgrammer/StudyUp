import { StrictMode, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import { AuthProvider, useAuth } from '@/contexts/AuthProvider'
import { Toaster } from '@/components/ui/sonner'
import './styles.css'

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  const routerContext = useMemo(() => auth, [auth])

  useEffect(() => {
    router.invalidate()
  }, [routerContext])

  return <RouterProvider router={router} context={{ auth: routerContext }} />
}

const queryClient = new QueryClient()
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <AuthProvider>
          <InnerApp />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
