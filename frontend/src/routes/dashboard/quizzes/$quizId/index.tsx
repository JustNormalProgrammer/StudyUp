import { createFileRoute } from '@tanstack/react-router'
import QuizPage from '@/pages/dashboard/quizzes/Quiz'

export const Route = createFileRoute('/dashboard/quizzes/$quizId/')({
  component: QuizPage,
})

