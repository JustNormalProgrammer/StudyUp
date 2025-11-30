import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  loader: () => {
    throw redirect({
      to: '/dashboard/home',
    });
  }, 
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/"!</div>
}
