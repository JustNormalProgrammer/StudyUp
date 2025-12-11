import { useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { useQuery } from '@tanstack/react-query'
import { Tag as TagIcon } from 'lucide-react'
import type { Tag } from '@/api/types'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { hexToRgba } from '@/utils/hexToRgba'

export function TagSuggestionBox({
  value,
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
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const selectedTag = data.find((tag) => tag.tagId === value)

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          style={{
            ['--tag-color' as any]: hexToRgba(selectedTag?.color || '', 0.1),
          }}
          className="hover:bg-(--tag-color)"
        >
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedTag ? (
              <div className={`flex items-center gap-2`}>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selectedTag.color }}
                />
                {selectedTag.content}
              </div>
            ) : (
              <>
                <TagIcon /> Select tag
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[525px] p-0" align="start">
          <OptionsList setOpen={setOpen} setValue={setValue} options={data} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        asChild
        style={{
          ['--tag-color' as any]: hexToRgba(selectedTag?.color || '', 0.1),
        }}
        className="hover:bg-(--tag-color)"
      >
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedTag ? (
            <div className={`flex items-center gap-2`}>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedTag.color }}
              />
              {selectedTag.content}
            </div>
          ) : (
            <>
              <TagIcon /> Select tag
            </>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionsList setOpen={setOpen} setValue={setValue} options={data} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function OptionsList({
  setOpen,
  setValue,
  options,
}: {
  setOpen: (open: boolean) => void
  setValue: (value: string) => void
  options: Array<Tag>
}) {
  return (
    <Command>
      <CommandInput placeholder="Find tag..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.tagId}
              value={option.content}
              onSelect={(value) => {
                setValue(option.tagId)
                setOpen(false)
              }}
              className="hover:bg-(--tag-color)!"
              style={{
                ['--tag-color' as any]: hexToRgba(option.color, 0.1),
              }}
            >
              <div className={`flex items-center gap-2`}>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
                {option.content}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
