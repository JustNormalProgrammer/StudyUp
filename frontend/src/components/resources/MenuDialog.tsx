import { useState } from 'react'
import {
  DeleteIcon,
  MoreHorizontalIcon,
  SquarePenIcon,
  TrashIcon,
} from 'lucide-react'
import { ResourceDialog } from './Dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function DropdownMenuDialog({
  className,
  inSessionRemoveHandler,
}: {
  className?: string
  inSessionRemoveHandler?: () => void
}) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Open menu"
            size="icon-sm"
            className={cn('', className)}
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            {inSessionRemoveHandler && (
              <DropdownMenuItem onSelect={() => inSessionRemoveHandler()}>
                <DeleteIcon size={16} />
                Remove
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
              <SquarePenIcon size={16} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {}}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive flex flex-row gap-2 items-center"
            >
              <TrashIcon size={16} className="text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ResourceDialog open={showEditDialog} setOpen={setShowEditDialog} />
    </>
  )
}
