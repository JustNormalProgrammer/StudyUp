import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { StudyResource } from '@/api/types'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import ResourceList from '@/components/resources/List'
import { Input } from '@/components/ui/input'

function Recources() {
  const api = useAuthenticatedRequest()
  const { data, isLoading, error } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data } = await api.get<Array<StudyResource>>('/resources')
      return data
    },
  })
  const [search, setSearch] = useState('')
  const filteredResources = data?.filter((resource) =>
    resource.title.toLowerCase().includes(search.toLowerCase()),
  )
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      <Input
        placeholder="Search resources..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ResourceList
        resources={filteredResources || []}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      />
    </div>
  )
}

export default Recources
