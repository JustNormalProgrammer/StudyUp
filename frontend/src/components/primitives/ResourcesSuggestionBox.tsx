import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ListPlus } from 'lucide-react'
import ResourceItem from '../resources/Item'
import type { StudyResource } from '@/api/types'
import { useIsMobile } from '@/hooks/use-mobile'
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

export function ResourcesSuggestionBox({
  value,
  setValue,
  resourcesData,
}: {
  value: Array<{ resourceId: string; label?: string }>
  setValue: (value: Array<{ resourceId: string; label?: string }>) => void
  resourcesData: Array<StudyResource>
}) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile();
  const selectedResources = resourcesData.filter((resource) =>
    value.some((r) => r.resourceId === resource.resourceId),
  )
  const remainingResources = resourcesData.filter(
    (resource) => !selectedResources.includes(resource),
  )
  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            <>
              <ListPlus /> Add resource
            </>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[703px] p-0" align="start">
          <OptionsList
            setOpen={setOpen}
            setValue={(option) => {
              setValue([{ resourceId: option }, ...value])
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
              setValue([...value, { resourceId: option }])
            }}
            options={resourcesData}
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
              onSelect={() => {
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
