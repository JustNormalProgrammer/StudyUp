import { createFileRoute } from '@tanstack/react-router'
import CreateSession from '@/pages/dashboard/sessions/Create'

export const Route = createFileRoute('/_auth/dashboard/study-sessions/create')({
  component: CreateSession,
})

