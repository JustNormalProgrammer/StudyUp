import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/study-sessions/$sessionId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/study-sessions/$sessionId/"!</div>
}
