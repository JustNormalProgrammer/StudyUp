import { createFileRoute } from '@tanstack/react-router'
import EmailVerification from '@/pages/Auth/EmailVerification'

export const Route = createFileRoute('/verify-email')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EmailVerification />
}
