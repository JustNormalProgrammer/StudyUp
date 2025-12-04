import { Card } from '../ui/card'
import ResourceItem from './Item'
import { DropdownMenuDialog } from './MenuDialog'
import type { StudyResource } from '@/api/types'

export default function ResourceCard({
  resource,
  inSessionRemoveHandler,
}: {
  resource: StudyResource
  inResourceList?: boolean
  inSessionRemoveHandler?: () => void
}) {
  return (
    <Card className="flex flex-row p-4 gap-5 items-center flex-9">
      <ResourceItem resource={resource} />
      <DropdownMenuDialog inSessionRemoveHandler={inSessionRemoveHandler}/>
    </Card>
  )
}
