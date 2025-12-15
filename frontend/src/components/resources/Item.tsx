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
  label,
}: {
  disableLink?: boolean
  resource: StudyResource
  label?: string
}) {
  const ResourceTypeIcon = ResourceTypeIcons[resource.type]
  return (
    <>
      <ResourceTypeIcon size={26} className="shrink-0" />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
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
            <div className="text-sm font-medium w-fit break-all line-clamp-1 text-ellipsis overflow-hidden">
              {resource.title}
            </div>
          </ConditionalWrapper>
          {label && <div className="text-xs px-2 py-1 bg-primary/40 rounded-xl" >{label}</div>}
        </div>
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
