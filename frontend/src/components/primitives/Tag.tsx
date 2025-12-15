import type { Tag as TagType } from '@/api/types'
import { hexToRgba } from '@/utils/hexToRgba'
import { cn } from '@/lib/utils'

export default function Tag({
  tag,
  className,
  onClick,
}: {
  tag: TagType
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      className={cn(
        `rounded-xl py-1 px-3 whitespace-nowrap flex items-center gap-2 cursor-default user-select-none bg-(--tag-color) brightness-90`,
        className,
      )}
      style={{
        ['--tag-color' as any]: hexToRgba(tag.color || '', 0.1),
      }}
      onClick={onClick}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: tag.color || '' }}
      />
      <div className="text-sm">{tag.content}</div>
    </div>
  )
}
