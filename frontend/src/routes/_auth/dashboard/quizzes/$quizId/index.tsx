import { createFileRoute } from '@tanstack/react-router'
import QuizPage from '@/pages/dashboard/quizzes/Quiz'

export const Route = createFileRoute('/_auth/dashboard/quizzes/$quizId/')({
  component: QuizPage,
})

