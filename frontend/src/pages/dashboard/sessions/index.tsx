import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import type { SessionFormData } from '@/components/dialogs/SessionForm'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import useDebounce from '@/hooks/useDebounce'
import { Button } from '@/components/ui/button'
import SessionForm from '@/components/dialogs/SessionForm'
import Search from '@/components/primitives/Search'
import SessionList from '@/components/sessions/SessionList'

export default function Sessions() {
  const api = useAuthenticatedRequest()
  const queryClient = useQueryClient()

  const [selectedTag, setSelectedTag] = useState('')
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false)
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 500)

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
      <Search
        placeholder="Search sessions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        selectedTag={selectedTag}
        setSelectedTag={(tag: string) => setSelectedTag(tag)}
        actionButton={
          <Button onClick={() => setShowCreateSessionDialog(true)}>
            <Plus />
            <div className="hidden xl:block">Create</div>
          </Button>
        }
      />
      <SessionList
        selectedTag={selectedTag}
        debouncedSearch={debouncedSearch}
      />
      <SessionForm
        open={showCreateSessionDialog}
        setOpen={setShowCreateSessionDialog}
        onSubmit={(data) => mutation.mutate(data)}
      />
    </div>
  )
}
