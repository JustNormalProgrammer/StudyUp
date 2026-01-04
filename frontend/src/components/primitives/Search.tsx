import { Plus } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { TagSuggestionBox } from './TagSugestionBox'

export default function Search({
  placeholder,
  value,
  onChange,
  selectedTag,
  setSelectedTag,
  actionButton,
}: {
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedTag: string
  setSelectedTag: (tag: string) => void
  actionButton?: React.ReactNode
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1"
      />
      <TagSuggestionBox
        value={selectedTag}
        setValue={(tag: string) => setSelectedTag(tag)}
        reset={true}
      />
    {actionButton}
    </div>
  )
}
