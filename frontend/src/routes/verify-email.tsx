import { createFileRoute } from '@tanstack/react-router'
import EmailVerification from '@/pages/Auth/EmailVerification'

export const Route = createFileRoute('/verify-email')({
  validateSearch: (search: Record<string, unknown>) => {
    // validate and parse the search params into a typed state
    return {
      token: search.token || ""
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <EmailVerification />
}
