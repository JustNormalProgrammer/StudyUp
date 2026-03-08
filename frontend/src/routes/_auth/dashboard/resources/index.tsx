import { createFileRoute } from '@tanstack/react-router'
import Resources from '@/pages/dashboard/resources/Index'

export const Route = createFileRoute('/_auth/dashboard/resources/')({
  component: Resources,
})
