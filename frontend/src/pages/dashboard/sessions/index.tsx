import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Calendar, Hourglass, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { StudySession, Tag as TagType } from '@/api/types'
import type { SessionFormData } from '@/components/dialogs/SessionForm'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import useDebounce from '@/hooks/useDebounce'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import TagSelector from '@/components/sessions/TagSelector'
import SessionForm from '@/components/dialogs/SessionForm'
import Tag from '@/components/primitives/Tag'
import { hexToRgba } from '@/utils/hexToRgba'
import { Spinner } from '@/components/ui/spinner'
import { TagSuggestionBox } from '@/components/primitives/TagSugestionBox'

const LIMIT = 20

export default function Sessions() {
  const api = useAuthenticatedRequest()
  const queryClient = useQueryClient()
  const observerRef = useRef<HTMLLIElement | null>(null)

  const [selectedTag, setSelectedTag] = useState('')
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false)
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['sessions', selectedTag, debouncedSearch],
      initialPageParam: 0,
      queryFn: async ({ pageParam }) => {
        const { data } = await api.get<Array<StudySession>>('/sessions', {
          params: {
            ...(selectedTag && { tagId: selectedTag }),
            ...(debouncedSearch && { q: debouncedSearch }),
            start: pageParam,
            limit: LIMIT,
          },
        })

        return {
          data,
          nextPage: pageParam + LIMIT,
        }
      },
      getNextPageParam: (lastPage) =>
        lastPage.data.length < LIMIT ? undefined : lastPage.nextPage,
    })
  const onIntersect = useCallback(
    (entries: Array<IntersectionObserverEntry>) => {
      const entry = entries[0]
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  useEffect(() => {
    if (!observerRef.current) return

    const observer = new IntersectionObserver(onIntersect, {
      threshold: 0.1,
    })

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [onIntersect])

  const mutation = useMutation({
    mutationFn: (sessionData: SessionFormData) =>
      api.post('/sessions', sessionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      setShowCreateSessionDialog(false)
      toast.success('Session created successfully')
    },
    onError: () => {
      toast.error('Failed to create session')
    },
  })

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      <div className="flex gap-2 flex-wrap">
        <Input
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <TagSuggestionBox
          value={selectedTag}
          setValue={(tag: string) => setSelectedTag(tag)}
          reset={true}
        />
        <Button onClick={() => setShowCreateSessionDialog(true)}>
          <Plus />
          <div className="hidden xl:block">Create session</div>
        </Button>
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground mt-10">
          Loading sessions...
        </div>
      )}

      {data?.pages.flatMap((page) =>
        page.data.map((session) => (
          <Link
            key={session.sessionId}
            to="/dashboard/study-sessions/$sessionId"
            params={{ sessionId: session.sessionId }}
          >
            <Card
              className="relative overflow-hidden py-4 transition hover:shadow-md"
              style={{
                ['--tag-color' as any]: hexToRgba(session.tag.color, 0.04),
                backgroundColor: 'var(--tag-color)',
              }}
            >
              <div
                className="absolute left-0 top-0 h-full w-1"
                style={{ backgroundColor: session.tag.color }}
              />

              <CardContent className="flex items-center gap-5">
                <div className="flex flex-col gap-1 w-xl overflow-hidden text-ellipsis">
                  <CardTitle className="text-sm line-clamp-2 text-ellipsis overflow-hidden">
                    {session.title}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-1">
                    {session.notes}
                  </CardDescription>
                </div>

                <Tag
                  tag={session.tag}
                  className="hidden md:flex ml-4 max-w-[200px] min-w-0 overflow-hidden text-ellipsis"
                />

                <div className="ml-auto flex gap-6 text-xs text-muted-foreground">
                  <div className="hidden xl:flex items-center gap-1">
                    <Hourglass className="h-4 w-4" />
                    {session.durationMinutes} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(session.startedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )),
      )}

      <li ref={observerRef} className="flex justify-center py-6">
        {isFetchingNextPage && <Spinner />}
      </li>

      <SessionForm
        open={showCreateSessionDialog}
        setOpen={setShowCreateSessionDialog}
        onSubmit={(data) => mutation.mutate(data)}
      />
    </div>
  )
}
