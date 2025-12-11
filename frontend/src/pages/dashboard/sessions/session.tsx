import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  BoxIcon,
  Calendar,
  Hourglass,
  MessageCircleQuestionMark,
} from 'lucide-react'
import type { StudyResource, StudySession } from '@/api/types'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import ResourceCard from '@/components/resources/Card'

export default function session() {
  const { sessionId } = useParams({
    from: '/dashboard/study-sessions/$sessionId/',
  })
  const api = useAuthenticatedRequest()
  const { data, isLoading, error } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const { data } = await api.get<StudySession>(`/sessions/${sessionId}`)
      return data
    },
  })
  const { data: studyResources } = useQuery({
    queryKey: ['studyResources', sessionId],
    queryFn: async () => {
      const { data } = await api.get<Array<StudyResource>>(
        `/sessions/${sessionId}/resources`,
      )
      return data
    },
  })
  return (
    <div className="flex flex-col max-w-7xl mx-auto gap-5">
      <h1 className="text-2xl font-semibold">{data?.title}</h1>
      <div className="flex flex-row gap-1">
        <div className="flex gap-1">
          <Calendar className="w-4 h-4" />
          <p className="text-sm text-gray-600">
            {new Date(data?.startedAt ?? '').toLocaleString(undefined, {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex gap-1">
          <Hourglass className="w-4 h-4" />
          <p className="text-sm text-gray-600">{data?.durationMinutes} mins</p>
        </div>
      </div>
      <div className="text-sm text-gray-600">{data?.notes}</div>
      <div className="flex flex-col gap-4">
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
            <ResourceCard key={resource.resourceId} resource={resource} />
          ))}
        </div>
        <div className="flex flex-row gap-2 items-center">
          <MessageCircleQuestionMark className="w-4 h-4 md:w-6 md:h-6 antialiased" />
          <h2 className="text-lg font-semibold">Quizzes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {studyResources?.length === 0 && (
            <div className="text-sm text-gray-600">
              No quizzes added to this session
            </div>
          )}
          {studyResources?.map((resource) => (
            <ResourceCard key={resource.resourceId} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  )
}
