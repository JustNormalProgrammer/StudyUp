import { createFileRoute } from '@tanstack/react-router'
import Login from '@/pages/Auth/Login'

export const Route = createFileRoute('/login')({
  validateSearch: (search) => {
    return {
      redirect: (search.redirect as string) || '/dashboard',
    }
  },
  component: Login,
})
