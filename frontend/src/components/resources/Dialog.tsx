import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookIcon, GlobeIcon, LayersIcon, SquarePlayIcon } from 'lucide-react'
import { Field, FieldError, FieldLabel } from '../ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StudyResourceTypeEnum } from '@/api/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(StudyResourceTypeEnum, { error: 'Invalid type' }),
  desc: z.string().optional(),
  url: z.optional(z.url({ error: 'Invalid URL' })),
})

export function ResourceDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      type: StudyResourceTypeEnum.OTHER,
      desc: '',
      url: undefined,
    },
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) => console.log(data))}
          className="space-y-4"
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="type">Type</FieldLabel>
                <Select
                  name="type"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="desc"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="desc">Description</FieldLabel>
                <Textarea
                  id="desc"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Add additional information..."
                  rows={2}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="url" aria-invalid={fieldState.invalid}>
                  URL
                </FieldLabel>
                <Input
                  id="url"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? undefined : e.target.value,
                    )
                  }
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
