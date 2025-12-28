import { useState } from 'react'
import {
  DeleteIcon,
  MoreHorizontalIcon,
  SquarePenIcon,
  TrashIcon,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ResourceDialog } from './Dialog'
import type { StudyResource } from '@/api/types'
import type { ResourceDialogForm } from './Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'

export function DropdownMenuDialog({
  resource,
  className,
  inSessionRemoveHandler,
}: {
  resource: StudyResource
  className?: string
  inSessionRemoveHandler?: () => void
}) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const api = useAuthenticatedRequest()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (resourceData: ResourceDialogForm) => {
      const { data } = await api.put(
        `/resources/${resource.resourceId}`,
        resourceData,
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['studyResources'] })
      toast.success('Resource updated successfully')
      setShowEditDialog(false)
    },
    onError: () => {
      toast.error('Failed to update resource')
    },
  })
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/resources/${resource.resourceId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['studyResources'] })
      toast.success('Resource deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete resource')
    },
  })
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button aria-label="Open menu" className={cn('p-2', className)}>
            <MoreHorizontalIcon size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            {inSessionRemoveHandler ? (
              <>
                <DropdownMenuItem onSelect={() => inSessionRemoveHandler()}>
                  <DeleteIcon size={16} />
                  Remove
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                  <SquarePenIcon size={16} />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    deleteMutation.mutate()
                  }}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive flex flex-row gap-2 items-center"
                >
                  <TrashIcon size={16} className="text-destructive" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ResourceDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        resource={resource}
        onSubmit={mutation.mutate}
        isLoading={mutation.isPending}
      />
    </>
  )
}
