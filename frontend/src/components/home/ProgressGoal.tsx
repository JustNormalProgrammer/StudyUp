import { BookOpenIcon, BoxIcon, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import SessionForm from '../dialogs/SessionForm'
import ProgressBar from '../charts/ProgressBar'
import CreateTagDialog from '../dialogs/TagDialog'
import type { SessionFormData } from '../dialogs/SessionForm'
import type { UserSettings } from '@/api/types'
import type { ResourceDialogForm } from '@/components/dialogs/ResourceDialog'
import type { CreateTagForm } from '../dialogs/TagDialog'
import { Separator } from '@/components/ui/separator'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { getWeekRange } from '@/utils/getWeekRange'
import { ResourceDialog } from '@/components/dialogs/ResourceDialog'

type StudySessionResponse = {
  duration: number
  startedAt: string
  title: string
  sessionId: string
}
type QuizResponse = {
  score: number
  quizId: string
  quizAttemptId: string
  title: string
  finishedAt: string
}

function isToday(dateString: string) {
  const d = new Date(dateString).toDateString()
  const now = new Date().toDateString()

  return d === now
}

export default function ProgressGoal() {
  const api = useAuthenticatedRequest()
  const { from, to } = getWeekRange(new Date())
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get<UserSettings>('/user/settings')
      return data
    },
  })
  const { data: barData } = useQuery({
    queryKey: ['weekly-chart', 'progress', from, to],
    queryFn: async () => {
      const { data } = await api.get<{
        sessionsData: Array<StudySessionResponse>
        quizAttemptsData: Array<QuizResponse>
      }>(
        `/user/chart-data?from=${from.toISOString()}&to=${to.toISOString()}&goal=true`,
      )
      return data
    },
  })

  const todaySessions =
    barData?.sessionsData.filter((s) => isToday(s.startedAt)) || []
  console.log(todaySessions)

  const progress = todaySessions.reduce((acc, s) => acc + s.duration, 0)

  return (
    <>
      <Card>
        <CardContent className="h-full flex flex-col gap-3">
          <div className="text-md font-semibold">Daily Study Goal</div>
          <Separator />
          <ProgressBar
            value={progress}
            maxValue={settings?.dailyStudyGoal ?? 60}
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
              value={barData?.quizAttemptsData.length ?? 0}
              maxValue={settings?.weeklyQuizGoal ?? 14}
              label="quizzes"
              showReferenceLines={true}
            />
            <div className="text-sm font-semibold">Study goal</div>
            <ProgressBar
              value={
                barData?.sessionsData.reduce((acc, s) => acc + s.duration, 0) ??
                0
              }
              maxValue={(settings?.dailyStudyGoal ?? 60) * 7}
              label="min"
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
