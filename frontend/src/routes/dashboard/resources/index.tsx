import { createFileRoute } from '@tanstack/react-router'
import Resources from '@/pages/dashboard/resources/Index'

export const Route = createFileRoute('/dashboard/resources/')({
  component: Resources,
})
