import { createFileRoute } from '@tanstack/react-router'
import Attempt from '@/pages/dashboard/quizzes/Attempt'

export const Route = createFileRoute(
  '/dashboard/quizzes/$quizId/attempts/$attemptId',
)({
  component: Attempt,
})
