import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { ResourceDialogForm } from '@/components/resources/Dialog'
import type { StudyResource } from '@/api/types'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ResourceDialog } from '@/components/resources/Dialog'
import ResourceCard from '@/components/resources/Card'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
function Recources() {
  const queryClient = useQueryClient()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const api = useAuthenticatedRequest()
  const { data, isLoading, error } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data } = await api.get<Array<StudyResource>>('/resources')
      return data
    },
  })
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
    onError: (error) => {
      toast.error('Failed to create resource')
    },
  })
  const [search, setSearch] = useState('')
  const filteredResources = data?.filter((resource) =>
    resource.title.toLowerCase().includes(search.toLowerCase()),
  )
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      <div className="flex flex-row gap-2">
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus />
          Create
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredResources?.map((resource) => (
          <ResourceCard key={resource.resourceId} resource={resource} />
        ))}
      </div>
      <ResourceDialog open={showCreateDialog} setOpen={setShowCreateDialog} onSubmit={mutation.mutate} isLoading={mutation.isPending} />
    </div>
    
  )
}

export default Recources
