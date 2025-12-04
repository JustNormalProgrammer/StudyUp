import ResourceCard from './Card'
import type { StudyResource } from '@/api/types'
import { cn } from '@/lib/utils'

function ResourceList({
  resources,
  className,
  inSessionHandler,
}: {
  resources: Array<StudyResource>
  className?: string
  inSessionHandler?: (resourceId: string) => void
}) {
  return (
    <div className={cn('', className)}>
      {resources.map((resource) => (
        <ResourceCard key={resource.resourceId} resource={resource} inSessionHandler={inSessionHandler} />
      ))}
    </div>
  )
}

export default ResourceList
