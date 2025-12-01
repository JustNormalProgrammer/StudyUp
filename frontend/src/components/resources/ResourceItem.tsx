import {
  Book,
  Globe,
  Layers,
  SquareArrowOutUpRight,
  SquarePlay,
} from 'lucide-react'
import IconLink from '../primitives/IconLink'
import { Card } from '../ui/card'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import type { StudyResource } from '@/api/types'
import { StudyResourceTypeEnum } from '@/api/types'

const ResourceTypeIcons = {
  [StudyResourceTypeEnum.WEBSITE]: Globe,
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
    <Card
      key={resource.resourceId}
      className="flex flex-row p-4 gap-5 items-center"
    >
      <ResourceTypeIcon size={20} />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex flex-row justify-between items-center">
          <div className="text-sm font-medium">{resource.title}</div>
          {resource.url && (
            <a href={resource.url} target="_blank" referrerPolicy='no-referrer'>
              <Button
                variant="ghost"
                className="size-6"
                aria-label="Submit"
                color="primary"
              >
                <SquareArrowOutUpRight size={20} />
              </Button>
            </a>
          )}
        </div>
        {resource.desc && (
          <>
            <Separator orientation="horizontal" className="w-full" />
            <div className="text-xs">{resource.desc}</div>
          </>
        )}
      </div>
    </Card>
  )
}
