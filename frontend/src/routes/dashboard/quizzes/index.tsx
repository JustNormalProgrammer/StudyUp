import { createFileRoute } from '@tanstack/react-router'
import Quizzes from '@/pages/dashboard/quizzes/Index'

export const Route = createFileRoute('/dashboard/quizzes/')({
  component: Quizzes,
})

