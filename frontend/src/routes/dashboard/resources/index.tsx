import { createFileRoute } from '@tanstack/react-router'
import Recources from '@/pages/dashboard/resources/index'

export const Route = createFileRoute('/dashboard/resources/')({
  component: Recources,
})
