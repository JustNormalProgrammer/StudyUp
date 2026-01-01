import { hexToRgba } from '@/utils/hexToRgba'
import { cn } from '@/lib/utils'

export default function Tag({
  tag,
  className,
  size = 'md',
  onClick,
}: {
  tag: {
    content: string
    color: string
  }
  className?: string
  size?: 'sm' | 'md'
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
        className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full shrink-0`}
        style={{ backgroundColor: tag.color || '' }}
      />
      <div className={`${size === 'sm' ? 'text-xs font-medium' : 'text-sm'} text-ellipsis overflow-hidden`}>{tag.content}</div>
    </div>
  )
}
