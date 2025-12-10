import { createFileRoute } from '@tanstack/react-router'
import Settings from '@/pages/dashboard/settings'
export const Route = createFileRoute('/dashboard/settings')({
  component: Settings,
})
