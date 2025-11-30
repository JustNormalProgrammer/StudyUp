import { Book, Layers, Link, SquarePlay } from 'lucide-react'
import IconLink from '../primitives/IconLink'
import { Card } from '../ui/card'
import type { StudyResource } from '@/api/types'
import { StudyResourceTypeEnum } from '@/api/types'

const ResourceTypeIcons = {
  [StudyResourceTypeEnum.URL]: Link,
  [StudyResourceTypeEnum.VIDEO]: SquarePlay,
  [StudyResourceTypeEnum.BOOK]: Book,
  [StudyResourceTypeEnum.OTHER]: Layers,
}

export default function ResourceItem({
  resource,
}: {
  resource: StudyResource
}) {
  const ResourceTypeIcon = ResourceTypeIcons[resource.type]
  return (
    <Card key={resource.resourceId} className="flex flex-row p-4 gap-5 items-center">
      <ResourceTypeIcon size={20} />
      <div className="flex flex-col gap-1">
        {resource.title}
        {resource.type === 'url' && (
          <a href={resource.content ?? ''} target="_blank" className="text-sm wrap-anywhere text-primary underline-offset-4 hover:underline visited:text-primary/80">{resource.content}</a>
        )}
      </div>
    </Card>
  )
}
