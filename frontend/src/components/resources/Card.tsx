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
    <Card className="flex flex-row p-4 gap-5 items-center flex-9">
      <ResourceItem resource={resource} label={label} value={value} setValue={setValue} />
      <DropdownMenuDialog resource={resource} inSessionRemoveHandler={inSessionRemoveHandler}/>
    </Card>
  )
}
