import { useQuery } from '@tanstack/react-query'
import { useErrorBoundary } from 'react-error-boundary'
import { Card, CardContent } from '../ui/card'
import ProgressBar from '../charts/ProgressBar'
import { Skeleton } from '../ui/skeleton'
import type { UserProgressData, UserSettings } from '@/api/types'
import { Separator } from '@/components/ui/separator'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'

export default function ProgressGoal() {
  const api = useAuthenticatedRequest()
  const { showBoundary } = useErrorBoundary()
  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get<UserSettings>('/user/settings')
      return data
    },
  })
  const progressDataQuery = useQuery({
    queryKey: ['chart', 'progress'],
    queryFn: async () => {
      const { data } = await api.get<UserProgressData>(
        '/user/chart-data/progress',
      )
      return data
    },
  })
  if (progressDataQuery.data && settingsQuery.data) {
    return (
      <>
        <Card>
          <CardContent className="h-full flex flex-col gap-3">
            <div className="text-md font-semibold">Daily Study Goal</div>
            <Separator />
            <ProgressBar
              value={progressDataQuery.data.todayProgress}
              maxValue={settingsQuery.data.dailyStudyGoal}
              label="min"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="h-full  flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-md font-semibold">Weekly Goals</div>
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              <div className="text-sm font-semibold">Quizzes</div>
              <ProgressBar
                value={progressDataQuery.data.weeklyQuizProgress}
                maxValue={settingsQuery.data.weeklyQuizGoal}
                label="quizzes"
                showReferenceLines={true}
              />
              <div className="text-sm font-semibold">Study goal</div>
              <ProgressBar
                value={progressDataQuery.data.weeklySessionsProgress}
                maxValue={settingsQuery.data.dailyStudyGoal * 7}
                label="min"
              />
            </div>
          </CardContent>
        </Card>
      </>
    )
  }
  if (progressDataQuery.error || settingsQuery.error) {
    showBoundary(progressDataQuery.error || settingsQuery.error!)
  }
  return (
    <>
      <Card>
        <CardContent className="h-full flex flex-col gap-3">
          <div className="text-md font-semibold">Daily Study Goal</div>
          <Separator />
          <Skeleton className="h-5 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full  flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-md font-semibold">Weekly Goals</div>
          </div>
          <Separator />
          <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold">Quizzes</div>
            <Skeleton className="h-5 w-full" />
            <div className="text-sm font-semibold">Study goal</div>
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
