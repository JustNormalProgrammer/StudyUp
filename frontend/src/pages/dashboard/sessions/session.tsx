import { useParams } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BoxIcon,
  Calendar,
  Hourglass,
  MessageCircleQuestionMark,
  Pencil,
  Trash,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Quiz, StudyResource, StudySession } from '@/api/types'
import type { SessionFormData } from '@/components/sessions/SessionForm'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import ResourceCard from '@/components/resources/Card'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Tag from '@/components/primitives/Tag'
import SessionForm from '@/components/sessions/SessionForm'
import QuizCard from '@/components/quiz/QuizCard'
import CreateQuizDialog from '@/components/sessions/CreateQuizDialog'

export default function Session() {
  const { sessionId } = useParams({
    from: '/dashboard/study-sessions/$sessionId/',
  })
  const api = useAuthenticatedRequest()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [openAiSLOP, setOpenAiSLOP] = useState(false)
  const { data, isLoading, error } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const { data } = await api.get<StudySession>(`/sessions/${sessionId}`)
      return data
    },
  })
  const { data: studyResources, isSuccess: isStudyResourcesSuccess } = useQuery({
    queryKey: ['studyResources', sessionId],
    queryFn: async () => {
      const { data } = await api.get<Array<StudyResource & { label?: string }>>(
        `/sessions/${sessionId}/resources`,
      )
      return data
    },
  })
  const { data: quizzes } = useQuery({
    queryKey: ['quizzes', sessionId],
    queryFn: async () => {
      const { data } = await api.get<
        Array<{
          quizId: string
          title: string
          isMultipleChoice: boolean
          numberOfQuestions: number
        }>
      >(`/sessions/${sessionId}/quizzes`)
      return data
    },
  })
  const mutation = useMutation({
    mutationFn: (sessionData: SessionFormData) => {
      return api.put(`/sessions/${sessionId}`, sessionData)
    },
    onSuccess: () => {
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
      queryClient.invalidateQueries({ queryKey: ['studyResources', sessionId] })
      toast.success('Session updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update session')
    },
  })
  return (
    <div className="flex flex-col max-w-7xl mx-auto gap-3 md:gap-10 border rounded-xl p-4">
      <div className="flex flex-col md:flex-row justify-between gap-1 items-center">
        <h1 className="text-2xl font-semibold break-all text-ellipsis overflow-hidden">
          {data?.title}
        </h1>
      </div>
      <div className="flex flex-row gap-5 items-center flex-wrap justify-between">
        <div className="flex flex-row gap-5 items-center flex-wrap">
          {data?.tag && <Tag tag={data.tag} />}
          <div className="flex gap-1 items-center">
            <Hourglass className="w-4 h-4" />
            <p className="text-sm text-gray-600 whitespace-nowrap">
              {data?.durationMinutes} mins
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <Calendar className="w-4 h-4" />
            <p className="text-sm text-gray-600 whitespace-nowrap">
              {new Date(data?.startedAt ?? '').toLocaleString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2  md:gap-4 self-end ">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setOpen(true)}
                className="w-fit"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon" className="w-fit">
                <Trash className="w-4 h-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="text-sm text-gray-600">{data?.notes}</div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-2 items-center">
          <BoxIcon className="w-4 h-4 md:w-6 md:h-6 antialiased" />
          <h2 className="text-lg font-semibold">Resources</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {studyResources?.length === 0 && (
            <div className="text-sm text-gray-600">
              No resources added to this session
            </div>
          )}
          {studyResources?.map((resource) => (
            <ResourceCard
              key={resource.resourceId}
              resource={resource}
              label={resource.label}
              disableDropdown={true}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <MessageCircleQuestionMark className="w-4 h-4 md:w-6 md:h-6 antialiased" />
            <h2 className="text-lg font-semibold">Quizzes</h2>
          </div>
          <Button variant="destructive" onClick={() => setOpenAiSLOP(true)}>
            AI SLOP
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quizzes?.length === 0 && (
            <div className="text-sm text-gray-600">
              No quizzes created for this session
            </div>
          )}
          {quizzes?.map((quiz) => (
            <QuizCard key={quiz.quizId} quiz={quiz} />
          ))}
        </div>
      </div>
      {isStudyResourcesSuccess && (
        <SessionForm
          open={open}
          setOpen={setOpen}
          sessionData={{ session: data, resources: studyResources }}
          onSubmit={(data) => mutation.mutate(data)}
        />
      )}
      <CreateQuizDialog open={openAiSLOP} setOpen={setOpenAiSLOP} />
    </div>
  )
}
