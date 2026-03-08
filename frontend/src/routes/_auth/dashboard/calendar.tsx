import { createFileRoute } from '@tanstack/react-router'
import Calendar from '@/components/calendar/Calendar'


export const Route = createFileRoute('/_auth/dashboard/calendar')({
  component: Calendar,
})

