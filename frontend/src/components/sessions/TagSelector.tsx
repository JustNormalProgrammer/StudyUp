import { useQuery } from '@tanstack/react-query'
import type { Tag } from '@/api/types'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { hexToRgba } from '@/utils/hexToRgba'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export default function TagSelector({
  value,
  onClick,
}: {
  value?: string
  onClick?: (value: Tag) => void
}) {
  const api = useAuthenticatedRequest()
  const { data = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await api.get<Array<Tag>>('/tags')
      return data
    },
  })
  return (
    <ScrollArea className="w-full">
      <div className="flex flex-row gap-2 pb-2">
        {data.map((tag) => (
          <div
            key={tag.tagId}
            className={`rounded-xl py-1 px-3 whitespace-nowrap flex items-center gap-2 cursor-pointer user-select-none text-ellipsis overflow-hidden 
              hover:bg-(--tag-color) hover:brightness-80 ${value === tag.tagId ? 'bg-(--tag-color) brightness-90' : ''}
            `}
            style={{
              ['--tag-color' as any]: hexToRgba(tag.color, 0.1),
            }}
            onClick={() => {
              onClick?.(tag)
            }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: tag.color }}
            />
            <div className="text-sm">{tag.content}</div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
