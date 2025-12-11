import { useQuery } from '@tanstack/react-query'
import { Calendar, CirclePlus, Clock, Hourglass, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { StudySession } from '@/api/types'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import TagSelector from '@/components/sessions/TagSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { hexToRgba } from '@/utils/hexToRgba'

export default function Sessions() {
  const api = useAuthenticatedRequest()
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [search, setSearch] = useState('')
  const { data, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await api.get<Array<StudySession>>('/sessions')
      return data
    },
  })
  const filteredData = selectedTag
    ? data?.filter((session) => session.tagId === selectedTag)
    : data
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      <div className="flex flex-row gap-2">
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button asChild>
          <Link to="/dashboard/study-sessions/create">
            <CirclePlus />
            Create new session
          </Link>
        </Button>
      </div>
      <TagSelector value={selectedTag} setValue={setSelectedTag} />
      {filteredData?.length === 0 && (
        <div className="text-center text-lg text-gray-600 mt-20">
          No sessions found
        </div>
      )}
      {filteredData?.map((session) => (
        <Link
          to="/dashboard/study-sessions/$sessionId"
          params={{ sessionId: session.sessionId }}
          key={session.sessionId}
        >
          <Card
            className="relative overflow-hidden py-4 hover:shadow-md  transition-all duration-200 hover:bg-(--tag-color)"
            style={{
              ['--tag-color' as any]: hexToRgba(session.tag.color, 0.02),
            }}
          >
            <div
              className="absolute top-0 left-0 h-full w-2"
              style={{ backgroundColor: session.tag.color }}
            ></div>
            <CardContent className="flex flex-row gap-4 items-center ">
              <div className="flex flex-col gap-2 ">
                <CardTitle className="text-sm text-ellipsis overflow-hidden ">
                  {session.title}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-gray-600 max-w-2xl line-clamp-1 text-ellipsis overflow-hidden">
                  {session.notes}
                </CardDescription>
              </div>
              <div className="flex flex-col  gap-2 w-20 md:flex-row-reverse md:justify-end  md:gap-6 ml-auto min-w-fit">
                <div className="flex flex-row gap-1 items-center">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  <div className="text-xs text-gray-600">
                    {new Date(session.startedAt).toLocaleString(undefined, {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="flex flex-row gap-1 items-center">
                  <Hourglass className="w-3 h-3 md:w-4 md:h-4" />
                  <div className="text-xs text-gray-600">
                    {session.durationMinutes} mins
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
