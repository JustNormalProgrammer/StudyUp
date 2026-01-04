import { BookIcon, GlobeIcon, LayersIcon, SquarePlayIcon } from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'
import { StudyResourceTypeEnum } from '@/api/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ResourceTypeSelect({
  name,
  value,
  onValueChange,
  reset = false,
}: {
  name?: string
  value?: StudyResourceTypeEnum
  onValueChange: (value: StudyResourceTypeEnum | undefined) => void
  reset?: boolean
}) {
  return (
    <Select name={name} value={value} onValueChange={(value) => {
      if (value === 'Reset_Show_All') {
        onValueChange(undefined)
      } else {
        onValueChange(value as StudyResourceTypeEnum)
      }
    }}>
      <SelectTrigger>
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        {reset && value && (
          <>
            <SelectItem value="Reset_Show_All" className="font-semibold">Show all</SelectItem>
            <div className="my-0.5 h-px bg-muted" />
          </>
        )}
        <SelectItem value={StudyResourceTypeEnum.VIDEO}>
          <SquarePlayIcon size={16} />
          Video
        </SelectItem>
        <SelectItem value={StudyResourceTypeEnum.BOOK}>
          <BookIcon size={16} />
          Book
        </SelectItem>
        <SelectItem value={StudyResourceTypeEnum.WEBSITE}>
          <GlobeIcon size={16} />
          Website
        </SelectItem>
        <SelectItem value={StudyResourceTypeEnum.OTHER}>
          <LayersIcon size={16} />
          Other
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
