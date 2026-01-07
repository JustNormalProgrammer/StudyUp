import { useState } from 'react'
import useDebounce from '@/hooks/useDebounce'
import Search from '@/components/primitives/Search'
import QuizList from '@/components/quiz/QuizList'



export default function Quizzes() {
  const [selectedTag, setSelectedTag] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      <Search
        placeholder="Search quizzes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        selectedTag={selectedTag}
        setSelectedTag={(tag: string) => setSelectedTag(tag)}
      />
      <QuizList selectedTag={selectedTag} debouncedSearch={debouncedSearch} />
    </div>
  )
}
