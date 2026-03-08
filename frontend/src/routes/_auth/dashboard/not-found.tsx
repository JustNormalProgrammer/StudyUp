import { createFileRoute } from '@tanstack/react-router'
import NotFound from '@/pages/dashboard/NotFound'

export const Route = createFileRoute('/_auth/dashboard/not-found')({
  component: NotFound,
})
