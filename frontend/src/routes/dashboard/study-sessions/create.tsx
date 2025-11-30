import { createFileRoute } from '@tanstack/react-router'
import CreateSession from '@/pages/dashboard/sessions/create'

export const Route = createFileRoute('/dashboard/study-sessions/create')({
  component: CreateSession,
})

