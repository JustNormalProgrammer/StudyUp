import ResourceItem from './ResourceItem'
import type { StudyResource } from '@/api/types'

function ResourceList({ resources }: { resources: Array<StudyResource> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {resources.map((resource) => (
        <ResourceItem key={resource.resourceId} resource={resource} />
      ))}
    </div>
  )
}

export default ResourceList
