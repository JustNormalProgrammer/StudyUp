import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import type { UseMutationResult } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'

export default function DeleteDialog({
  open,
  setOpen,
  mutation,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  mutation: UseMutationResult<AxiosResponse<void, any, {}>, Error, void, unknown>
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete confirmation</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this item? This action is permanent.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => mutation.mutate()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
