import { ArrowLeftIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center mt-60 gap-4">
      <div className="text-8xl text-gray-500 font-bold ">404</div>
      <div className="text-2xl text-gray-500">The page you are looking for does not exist.</div>
      <div className="text-sm text-gray-400">The link may be corrupted or the page may have been removed.</div>
      <Button asChild variant="link" className="text-muted-foreground text-lg">
        <Link to="/dashboard/home">Home</Link>
      </Button>
    </div>
  )
}
