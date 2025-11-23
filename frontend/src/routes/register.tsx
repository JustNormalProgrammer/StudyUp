import { createFileRoute } from '@tanstack/react-router'
import Register from '@/pages/Auth/Register'

export const Route = createFileRoute('/register')({
  component: Register,
})
