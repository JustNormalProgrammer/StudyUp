import { useQuery } from '@tanstack/react-query'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import type { StudySession } from '@/api/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Hourglass } from 'lucide-react'

export default function Sessions() {
  const api = useAuthenticatedRequest()
  const { data, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await api.get<Array<StudySession>>('/sessions')
      return data
    },
  })
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        {data?.map((session) => (
            <Card key={session.sessionId} className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-2" style={{ backgroundColor: session.tag.color }}></div>
                <CardContent className="flex flex-row justify-between items-center ">
                    <div className="flex flex-col gap-2">
                        <CardTitle>{session.title}</CardTitle>
                        <CardDescription className="text-xs text-gray-600">{session.notes}</CardDescription>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Clock />
                        {session.durationMinutes} minutes
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
  )
}