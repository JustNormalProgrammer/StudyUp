import { useQuery } from '@tanstack/react-query'
import type { Tag } from '@/api/types'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { hexToRgba } from '@/utils/hexToRgba'

export default function TagSelector({
  value = '9336e0dc-133a-4e0f-80c2-b1b04fe2e586',
  setValue,
}: {
  value: string
  setValue: (value: string) => void
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
    <div className="flex flex-row gap-2 flex-wrap">
      {data.map((tag) => (
        <div
          key={tag.tagId}
          className={`rounded-xl py-1 px-3 whitespace-nowrap flex items-center gap-2 cursor-pointer user-select-none ${value === tag.tagId ? 'bg-(--tag-color) brightness-90' : ''}
            hover:bg-(--tag-color) hover:brightness-80`}
          style={{
            ['--tag-color' as any]: hexToRgba(tag.color, 0.1),
          }}
          onClick={() => {
            if (value === tag.tagId) {
              setValue('')
              return
            }
            setValue(tag.tagId)
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
          <div className="text-sm">{tag.content}</div>
        </div>
      ))}
    </div>
  )
}
