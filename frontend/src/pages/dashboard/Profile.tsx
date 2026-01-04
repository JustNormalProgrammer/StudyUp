import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  BookOpen,
  BoxIcon,
  CircleOff,
  CircleSlash2,
  Hourglass,
  MessageCircleQuestionMark,
  Plus,
} from 'lucide-react'
import type { Tag as TagType, UserSettings, UserStats } from '@/api/types'
import type { CreateTagForm } from '@/components/dialogs/TagDialog'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import TagDialog from '@/components/dialogs/TagDialog'
import TagDialogWrapper from '@/components/primitives/TagDialogWrapper'
import Avatar from '@/components/primitives/Avatar'
import { useAuth } from '@/contexts/AuthProvider'
import { Spinner } from '@/components/ui/spinner'

export default function Profile() {
  const { user } = useAuth()
  const [showCreateTagDialog, setShowCreateTagDialog] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TagType | undefined>(undefined)
  const [studySliderValue, setStudySliderValue] = useState<number>()
  const [quizSliderValue, setQuizSliderValue] = useState<number>()
  const api = useAuthenticatedRequest()
  const queryClient = useQueryClient()
  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await api.get<Array<TagType>>('/tags')
      return data
    },
  })
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get<UserStats>('/user/stats')

      return data
    },
  })
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get<UserSettings>('/user/settings')
      setStudySliderValue(data.dailyStudyGoal)
      setQuizSliderValue(data.weeklyQuizGoal)
      return data
    },
  })
  const mutation = useMutation({
    mutationFn: (data: CreateTagForm) => {
      return api.post('/tags', data)
    },
    onSuccess: () => {
      toast.success('Tag created successfully')
    },
    onError: () => {
      toast.error('Failed to create tag')
    },
  })
  const studyGoalEditMutation = useMutation({
    mutationFn: (data: { dailyStudyGoal?: number; weeklyQuizGoal?: number }) => {
      return api.put('/user/settings', data)
    },
    onSuccess: () => {
      toast.success('Update successful')
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: () => {
      toast.error('Failed to update')
    },
  })
  return (
    <div className="flex flex-col max-w-7xl mx-auto gap-3 md:gap-10 border rounded-xl p-4">
      <div className="flex flex-row gap-2 mx-auto items-center">
        <Avatar className="h-30 w-30 text-6xl" />
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">{user?.username}</div>
          <div className="text-sm text-gray-600">{user?.email}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold">Daily Study Goal</div>
        <Separator />
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Slider
            value={[studySliderValue || 0]}
            max={240}
            step={1}
            min={15}
            className="w-full"
            onValueChange={(value) => setStudySliderValue(value[0])}
          />
          <div className="text-nowrap font-semibold w-30">
            {studySliderValue}{' '}
            <span className="text-sm text-gray-600 font-normal">min/day</span>
          </div>
          <Button
            className="flex-1 w-full min-w-[63px]"
            disabled={
              studySliderValue === settings?.dailyStudyGoal ||
              studyGoalEditMutation.isPending
            }
            onClick={() =>
              studyGoalEditMutation.mutate({ dailyStudyGoal: studySliderValue || 0 })
            }
          >
            {studyGoalEditMutation.isPending ? (
              <>
                <Spinner />
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold">Weekly Quiz Goal</div>
        <Separator />
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Slider
            value={[quizSliderValue || 0]}
            max={14}
            step={1}
            min={1}
            className="w-full"
            onValueChange={(value) => setQuizSliderValue(value[0])}
          />
          <div className="text-nowrap font-semibold w-30">
            {quizSliderValue}{' '}
            <span className="text-sm text-gray-600 font-normal">quizzes/week</span>
          </div>
          <Button
            className="flex-1 w-full min-w-[63px]"
            disabled={
              quizSliderValue === settings?.weeklyQuizGoal ||
              studyGoalEditMutation.isPending
            }
            onClick={() =>
              studyGoalEditMutation.mutate({ weeklyQuizGoal: quizSliderValue || 0 })
            }
          >
            {studyGoalEditMutation.isPending ? (
              <>
                <Spinner />
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold">Tags</div>
        <Separator />
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-2 flex-wrap">
            {tags?.map((tag) => (
              <>
                <TagDialogWrapper tag={tag} />
              </>
            ))}
          </div>
          <Button onClick={() => setShowCreateTagDialog(true)} size="sm">
            <Plus /> Tag
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold">Profile Statistics</div>
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
                {stats?.quizzesStats.averageQuizScore || <CircleOff className="size-5 mt-1 text-gray-600"  /> }
                <span hidden={!stats?.quizzesStats.averageQuizScore} className="text-sm text-gray-500 mx-0.5 font-normal">
                  %
                </span>
              </>
            }
            icon={<CircleSlash2 size={16} />}
          />
        </div>
      </div>
      <TagDialog
        open={showCreateTagDialog}
        setOpen={setShowCreateTagDialog}
        tag={selectedTag}
        mutation={mutation}
      />
    </div>
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
      <div className="text-2xl font-semibold">
        {value}
      </div>
    </div>
  )
}
