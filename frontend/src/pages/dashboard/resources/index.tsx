import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CircleX, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { ResourceDialogForm } from '@/components/dialogs/ResourceDialog'
import type { StudyResource, StudyResourceTypeEnum } from '@/api/types'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ResourceDialog } from '@/components/dialogs/ResourceDialog'
import ResourceCard from '@/components/resources/Card'
import useDebounce from '@/hooks/useDebounce'
import { Spinner } from '@/components/ui/spinner'
import ResourceTypeSelect from '@/components/primitives/ResourceTypeSelect'
import { Skeleton } from '@/components/ui/skeleton'

const LIMIT = 5

function Resources() {
  const queryClient = useQueryClient()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [type, setType] = useState<StudyResourceTypeEnum | undefined>()
  const api = useAuthenticatedRequest()

  const mutation = useMutation({
    mutationFn: async (resource: ResourceDialogForm) => {
      const { data } = await api.post('/resources', resource)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      setShowCreateDialog(false)
      toast.success('Resource created successfully')
    },
    onError: () => {
      toast.error('Failed to create resource')
    },
  })

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      <div className="flex flex-row gap-2">
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ResourceTypeSelect
          value={type}
          onValueChange={(value: StudyResourceTypeEnum | undefined) =>
            setType(value)
          }
          reset={true}
        />
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus />
          Create
        </Button>
      </div>
      <ResourceList search={debouncedSearch} type={type} />
      <ResourceDialog
        open={showCreateDialog}
        setOpen={setShowCreateDialog}
        onSubmit={mutation.mutate}
        isLoading={mutation.isPending}
      />
    </div>
  )
}

function ResourceList({
  search,
  type,
}: {
  search: string
  type: StudyResourceTypeEnum | undefined
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
    queryKey: ['resources', search, type],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<Array<StudyResource>>('/resources', {
        params: {
          ...(search && { q: search }),
          ...(type && { type }),
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-[100px]" />
        ))}
      </div>
    )
  }
  if (isError) {
    return (
      <div className="mx-auto flex flex-col gap-2 justify-center items-center mt-40">
        <CircleX className="size-10 text-red-500" />
        <div className="text-center text-muted-foreground">
          Failed to load resources
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data?.pages.flatMap((page) =>
          page.data.map((resource) => (
            <ResourceCard key={resource.resourceId} resource={resource} />
          )),
        )}
      </div>
      <li ref={observerRef} className="flex justify-center py-6">
        {isFetchingNextPage && <Spinner />}
      </li>
    </>
  )
}

export default Resources
