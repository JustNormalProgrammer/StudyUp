import { useInfiniteQuery } from '@tanstack/react-query'
import { Calendar, CircleX, Hourglass, RefreshCcw } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import type { StudySession } from '@/api/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import Tag from '@/components/primitives/Tag'
import { hexToRgba } from '@/utils/hexToRgba'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'

const LIMIT = 20

export default function SessionList({
  selectedTag,
  debouncedSearch,
}: {
  selectedTag: string
  debouncedSearch: string
}) {
  const observerRef = useRef<HTMLLIElement | null>(null)
  const api = useAuthenticatedRequest()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
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

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-[70px] my-2" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto flex flex-col gap-2 justify-center items-center mt-40">
        <CircleX className="size-10 text-red-500" />
        <div className="text-center text-muted-foreground">
          Failed to load sessions
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCcw className="size-4" />
          Reload
        </Button>
      </div>
    )
  }

  return (
    <>
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

      <li ref={observerRef} className="flex justify-center">
        {isFetchingNextPage && <Spinner />}
      </li>
      {!hasNextPage && (
        <div className="text-center text-muted-foreground">
          {data?.pages.length === 0 ? 'No sessions found' : 'No more sessions'}
        </div>
      )}
    </>
  )
}
