import { CirclePlus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { WeeklyChartStack } from '@/components/charts/MonthStack'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthProvider'

export default function Home() {
  const { user } = useAuth()
  return (
    <main className="grid grid-cols-1 justify-items-center md:grid-cols-2 gap-0 max-w-7xl mx-auto">
      <WeeklyChartStack />
      <Card className="w-full">
        <CardHeader>What did you learn today?</CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/dashboard/study-sessions/create">
              <CirclePlus />
              Add new session
            </Link>
          </Button>
        </CardContent>
      </Card>
      <div>
        <div>Dashboard</div>
        <div>{user?.username}</div>
        <div>{user?.userId}</div>
        <div>{user?.email}</div>
      </div>
    </main>
  )
}
