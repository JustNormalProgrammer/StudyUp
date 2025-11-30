import { createFileRoute } from '@tanstack/react-router'
import Home from '@/pages/dashboard/Home'

export const Route = createFileRoute('/dashboard/home')({
  component: Home,
})
