import { Card } from '../ui/card'
import ResourceItem from './Item'
import { DropdownMenuDialog } from './MenuDialog'
import type { StudyResource } from '@/api/types'

export default function ResourceCard({
  resource,
  label,
  inSessionRemoveHandler,
  value,
  setValue,
}: {
  resource: StudyResource
  label?: string
  inSessionRemoveHandler?: () => void
  value?: string
  setValue?: (value: string) => void
}) {
  
  return (
    <Card className="flex flex-row p-4 gap-7 items-center flex-9 overflow-hidden box-border relative">
      <div className="absolute top-0 left-0 h-full w-15 bg-gray-200 z-0"></div>
      <ResourceItem resource={resource} label={label} value={value} setValue={setValue} />
      <DropdownMenuDialog resource={resource} inSessionRemoveHandler={inSessionRemoveHandler} className="absolute top-0 right-0 cursor-pointer" />
    </Card>
  )
}
