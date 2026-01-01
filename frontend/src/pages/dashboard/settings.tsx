import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import type { Tag as TagType } from '@/api/types'
import type { CreateTagForm } from '@/components/dialogs/TagDialog'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import TagDialog from '@/components/dialogs/TagDialog'
import TagDialogWrapper from '@/components/primitives/TagDialogWrapper'

export default function Settings() {
  const [showCreateTagDialog, setShowCreateTagDialog] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TagType | undefined>(undefined)
  const [sliderValue, setSliderValue] = useState(50)
  const api = useAuthenticatedRequest()
  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await api.get<Array<TagType>>('/tags')
      return data
    },
  })
  const mutation = useMutation({
    mutationFn: (data: CreateTagForm) => {
      return api.post('/tags', data)
    },
    onSuccess: () => {
      toast.success('Tag created successfully')
    },
    onError: () => {
      toast.error('Failed to create tag')
    },
  })
  return (
    <div className="flex flex-col max-w-7xl mx-auto gap-3 md:gap-10 border rounded-xl p-4">
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold">Daily Study Goal</div>
        <Separator />
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Slider
            value={[sliderValue]}
            max={240}
            step={1}
            className="w-full"
            onValueChange={(value) => setSliderValue(value[0])}
          />
          <div className="text-nowrap font-semibold w-25">
            {sliderValue}{' '}
            <span className="text-sm text-gray-600 font-normal">min/day</span>
          </div>
          <Button className="flex-1 w-full">Save</Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold">Tags</div>
        <Separator />
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-2 flex-wrap">
            {tags?.map((tag) => (
              <>
                <TagDialogWrapper tag={tag} />
              </>
            ))}
          </div>
          <Button onClick={() => setShowCreateTagDialog(true)}>
            <Plus /> Tag
          </Button>
        </div>
      </div>
      <TagDialog
        open={showCreateTagDialog}
        setOpen={setShowCreateTagDialog}
        tag={selectedTag}
        mutation={mutation}
      />
    </div>
  )
}
