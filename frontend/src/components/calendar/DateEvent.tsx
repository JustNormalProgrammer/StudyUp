import { Card, CardContent } from '../ui/card'
import { hexToRgba } from '@/utils/hexToRgba'

export default function DateEvent({
  title,
  secInfo,
  colorBorder,
}: {
  title: string
  secInfo: React.ReactNode
  colorBorder: string
}) {
  return (
    <Card
      className="p-2 hover:bg-(--tag-color)"
      style={{
        ['--tag-color' as any]: hexToRgba(colorBorder || '', 0.05),
      }}
    >
      <CardContent className="flex flex-row items-center p-1 gap-4" >
        <div className="text-sm font-medium break-all line-clamp-2 overflow-hidden text-ellipsis flex-1">{title}</div>
        <div>{secInfo}</div>
      </CardContent>
    </Card>
  )
}
