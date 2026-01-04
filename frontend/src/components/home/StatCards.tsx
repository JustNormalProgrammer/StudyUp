import { useQuery } from '@tanstack/react-query'
import {
  BookOpen,
  BoxIcon,
  CircleOff,
  CircleSlash2,
  Hourglass,
  MessageCircleQuestionMark,
  Plus,
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import type { UserSettings, UserStats } from '@/api/types'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'

export default function StatCards() {
  const api = useAuthenticatedRequest()
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get<UserStats>('/user/stats')
      return data
    },
  })
  return (
      <Card className="w-full">
        <CardContent className="h-full flex flex-col gap-3">
          <div className="text-lg font-semibold">Statistics</div>
          <Separator />
          <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <ProfileStat
              title="Study sessions"
              value={stats?.sessionsStats.totalSessions}
              icon={<BookOpen size={16} />}
            />
            <ProfileStat
              title="Created Quizzes"
              value={stats?.quizzesStats.totalQuizzes}
              icon={<MessageCircleQuestionMark size={16} />}
            />
            <ProfileStat
              title="Added Resources"
              value={stats?.resourcesStats.totalResources}
              icon={<BoxIcon size={16} />}
            />
            <ProfileStat
              title="Time spent studying"
              value={
                stats?.sessionsStats.totalDuration && (
                  <>
                    {Math.floor(stats.sessionsStats.totalDuration / 60)}
                    <span className="text-sm text-gray-500 mx-0.5 font-normal">
                      hours
                    </span>
                    {stats.sessionsStats.totalDuration % 60}
                    <span className="text-sm text-gray-500 mx-0.5 font-normal">
                      mins
                    </span>
                  </>
                )
              }
              icon={<Hourglass size={16} />}
            />
            <ProfileStat
              title="Quiz attempts"
              value={stats?.quizzesStats.totalQuizAttempts}
              icon={<MessageCircleQuestionMark size={16} />}
            />
            <ProfileStat
              title="Average quiz score"
              value={
                <>
                  {stats?.quizzesStats.averageQuizScore || (
                    <CircleOff className="size-5 mt-1 text-gray-600" />
                  )}
                  <span
                    hidden={!stats?.quizzesStats.averageQuizScore}
                    className="text-sm text-gray-500 mx-0.5 font-normal"
                  >
                    %
                  </span>
                </>
              }
              icon={<CircleSlash2 size={16} />}
            />
          </div>
        </CardContent>
      </Card>
  )
}

function ProfileStat({
  title,
  value,
  icon,
}: {
  title: string
  value: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-row gap-2 items-center">
        {icon}
        <div className="text-lg text-gray-600 tracking-wide">{title}</div>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
