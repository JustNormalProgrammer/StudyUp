import { createFileRoute } from '@tanstack/react-router'
import Session from '@/pages/dashboard/sessions/Session'

export const Route = createFileRoute('/_auth/dashboard/study-sessions/$sessionId/')({
  component: Session,
})
