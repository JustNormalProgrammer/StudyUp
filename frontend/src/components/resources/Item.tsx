import {
  Book,
  Globe,
  Layers,
  SquareArrowOutUpRight,
  SquarePlay,
} from 'lucide-react'
import { Separator } from '../ui/separator'
import ConditionalWrapper from '../UtilComponents/ConditionalWrapper'
import type { StudyResource } from '@/api/types'
import { StudyResourceTypeEnum } from '@/api/types'

const ResourceTypeIcons = {
  [StudyResourceTypeEnum.WEBSITE]: Globe,
  [StudyResourceTypeEnum.VIDEO]: SquarePlay,
  [StudyResourceTypeEnum.BOOK]: Book,
  [StudyResourceTypeEnum.OTHER]: Layers,
}

export default function ResourceItem({
  disableLink = false,
  resource,
}: {
  disableLink?: boolean
  resource: StudyResource
}) {
  const ResourceTypeIcon = ResourceTypeIcons[resource.type]
  return (
    <>
      <ResourceTypeIcon size={26} />
      <div className="flex flex-col gap-1 w-full">
        <ConditionalWrapper
          condition={!!resource.url && !disableLink}
          wrapper={(children) => (
            <a
              href={resource.url}
              target="_blank"
              referrerPolicy="no-referrer"
              className="flex flex-row gap-2 items-center"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {children}
              <SquareArrowOutUpRight size={14} />
            </a>
          )}
        >
          <div className="text-sm font-medium">{resource.title}</div>
        </ConditionalWrapper>
        {resource.desc && (
          <>
            <Separator orientation="horizontal" className="w-full" />
            <div className="text-xs">{resource.desc}</div>
          </>
        )}
      </div>
    </>
  )
}
