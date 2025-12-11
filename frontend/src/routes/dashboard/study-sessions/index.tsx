import { createFileRoute } from '@tanstack/react-router'
import StudySessions from '@/pages/dashboard/sessions/Index'
export const Route = createFileRoute('/dashboard/study-sessions/')({
  component: StudySessions,
})
