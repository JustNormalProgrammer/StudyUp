import {
  Book,
  Globe,
  Layers,
  SquareArrowOutUpRight,
  SquarePlay,
} from 'lucide-react'
import { Separator } from '../ui/separator'
import ConditionalWrapper from '../UtilComponents/ConditionalWrapper'
import { Input } from '../ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
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
  value,
  setValue,
}: {
  disableLink?: boolean
  resource: StudyResource
  label?: string
  value?: string
  setValue?: (value: string) => void
}) {
  const ResourceTypeIcon = ResourceTypeIcons[resource.type]
  return (
    <>
      <ResourceTypeIcon size={26} className="shrink-0 z-10" />
      <div className="flex flex-col gap-1 w-full overflow-hidden">
        <div className="flex flex-row gap-2 items-center justify-between mr-5">
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
          {label && (
            <Tooltip>
              <TooltipTrigger>
                <div className="text-xs px-2 py-1 text-emerald-900 font-bold bg-primary/40 rounded-xl max-w-20 whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1">
                  {label}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {setValue && (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-20 text-xs p-0.5 h-fit box-border m-0.5"
              name="label"
              placeholder="eg. 1-12"
            />
          )}
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
