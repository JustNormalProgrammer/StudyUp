import { SquarePenIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import Tag from './Tag'
import type { Tag as TagType } from '@/api/types'
import type { CreateTagForm } from '@/components/dialogs/TagDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import TagDialog from '@/components/dialogs/TagDialog'
import DeleteDialog from '@/components/dialogs/Delete'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'

export default function TagDialogWrapper({ tag }: { tag: TagType }) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const api = useAuthenticatedRequest()
  const queryClient = useQueryClient()
  const editMutation = useMutation({
    mutationFn: (data: CreateTagForm) => {
      return api.put(`/tags/${tag.tagId}`, data)
    },
    onSuccess: () => {
      toast.success('Tag updated successfully')
      setShowEditDialog(false)
    },
    onError: () => {
      toast.error('Failed to update tag')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => {
      return api.delete(`/tags/${tag.tagId}`)
    },
    onSuccess: () => {
      toast.success('Tag deleted successfully')
      setShowDeleteDialog(false)
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
    onError: () => {
      toast.error('Failed to delete tag')
    },
  })

  return (
    <>
      <DropdownMenu key={tag.tagId}>
        <DropdownMenuTrigger>
          <Tag key={tag.tagId} tag={tag} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
              <SquarePenIcon size={16} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setShowDeleteDialog(true)
              }}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive flex flex-row gap-2 items-center"
            >
              <TrashIcon size={16} className="text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TagDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        tag={tag}
        mutation={editMutation}
      />
      <DeleteDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        mutation={deleteMutation}
        secInfo={
          <div className="text-sm text-red-600 font-semibold">
            Deleting this tag will permanently remove all sessions and quizzes
            that it is associated with.
          </div>
        }
      />
    </>
  )
}
