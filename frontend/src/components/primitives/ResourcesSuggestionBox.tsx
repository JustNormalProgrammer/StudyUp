import { useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { useQuery } from '@tanstack/react-query'
import { ListPlus, Tag as TagIcon } from 'lucide-react'
import ResourceItem from '../resources/Item'
import type { StudyResource, Tag } from '@/api/types'
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

export function ResourcesSuggestionBox({
  value,
  setValue,
  setSelectedResources,
}: {
  value: Array<{ resourceId: string; label?: string }>
  setValue: (value: Array<{ resourceId: string; label?: string }>) => void
  setSelectedResources: (value: Array<StudyResource>) => void
}) {
  const api = useAuthenticatedRequest()
  const { data = [] } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data } = await api.get<Array<StudyResource>>('/resources')
      return data
    },
  })
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const selectedResources = data.filter((resource) =>
    value.some((r) => r.resourceId === resource.resourceId),
  )
  const remainingResources = data.filter(
    (resource) => !selectedResources.includes(resource),
  )
  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            <>
              <ListPlus /> Select resource
            </>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[525px] p-0" align="start">
          <OptionsList
            setOpen={setOpen}
            setValue={(option) => {
              setValue([{ resourceId: option }, ...value])
              setSelectedResources([
                ...selectedResources,
                data.find((resource) => resource.resourceId === option)!,
              ])
            }}
            options={remainingResources}
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          <>
            <ListPlus /> Select resource
          </>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionsList
            setOpen={setOpen}
            setValue={(option) => {
              setValue([...value, option])
              setSelectedResources([
                ...selectedResources,
                data.find((resource) => resource.resourceId === option)!,
              ])
            }}
            options={data}
          />
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
  options: Array<StudyResource>
}) {
  return (
    <Command>
      <CommandInput placeholder="Find resource..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.resourceId}
              value={option.title}
              onSelect={(value) => {
                setValue(option.resourceId)
                setOpen(false)
              }}
            >
              <ResourceItem resource={option} disableLink={true} />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
