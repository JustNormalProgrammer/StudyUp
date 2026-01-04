import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { BookOpenIcon, BoxIcon, Tag } from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import SessionForm from '../dialogs/SessionForm'
import { ResourceDialog } from '../dialogs/ResourceDialog'
import CreateTagDialog from '../dialogs/TagDialog'
import type { SessionFormData } from '../dialogs/SessionForm'
import type { ResourceDialogForm } from '../dialogs/ResourceDialog'
import type { CreateTagForm } from '../dialogs/TagDialog'

import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'

export default function ActionButtons() {
  const api = useAuthenticatedRequest()
  const queryClient = useQueryClient()
  const [showCreateSessionDialog, setShowCreateSessionDialog] = useState(false)
  const [showCreateResourceDialog, setShowCreateResourceDialog] =
    useState(false)
  const [showCreateTagDialog, setShowCreateTagDialog] = useState(false)
  const sessionMutation = useMutation({
    mutationFn: (sessionData: SessionFormData) => {
      return api.post('/sessions', sessionData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      setShowCreateSessionDialog(false)
      toast.success('Session created successfully')
    },
    onError: (error) => {
      console.log(error)
      toast.error('Failed to create session')
    },
  })
  const resourceMutation = useMutation({
    mutationFn: async (resource: ResourceDialogForm) => {
      const { data } = await api.post('/resources', resource)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      setShowCreateResourceDialog(false)
      toast.success('Resource created successfully')
    },
    onError: () => {
      toast.error('Failed to create resource')
    },
  })
  const tagMutation = useMutation({
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

  return (
    <div className="flex flex-row gap-0 rounded-xl overflow-hidden shadow-sm h-12">
      <Button
        onClick={() => setShowCreateResourceDialog(true)}
        asChild
        className="rounded-none flex-1 h-full"
      >
        <div className="flex flex-row items-center gap-2">
          <BoxIcon />
          <span className=" font-semibold">Resource</span>
        </div>
      </Button>
      <Separator orientation="vertical" className="h-full" />
      <Button
        onClick={() => setShowCreateTagDialog(true)}
        asChild
        variant="secondary"
        className="rounded-none flex-1 h-full"
      >
        <div className="flex flex-row items-center gap-2">
          <Tag />
          <span className=" font-semibold">Tag</span>
        </div>
      </Button>
      <Separator orientation="vertical" className="h-full" />
      <Button
        onClick={() => setShowCreateSessionDialog(true)}
        asChild
        className="rounded-none flex-1 h-full"
      >
        <div className="flex flex-row items-center gap-2">
          <BookOpenIcon />
          <span className=" font-semibold">Session</span>
        </div>
      </Button>
      <SessionForm
        open={showCreateSessionDialog}
        setOpen={setShowCreateSessionDialog}
        onSubmit={sessionMutation.mutate}
      />
      <ResourceDialog
        open={showCreateResourceDialog}
        setOpen={setShowCreateResourceDialog}
        onSubmit={resourceMutation.mutate}
      />
      <CreateTagDialog
        open={showCreateTagDialog}
        setOpen={setShowCreateTagDialog}
        mutation={tagMutation}
      />
    </div>
  )
}
