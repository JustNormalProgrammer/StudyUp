import { createFileRoute } from '@tanstack/react-router'
import Calendar from '@/components/calendar/Calendar'


export const Route = createFileRoute('/dashboard/calendar')({
  component: Calendar,
})

