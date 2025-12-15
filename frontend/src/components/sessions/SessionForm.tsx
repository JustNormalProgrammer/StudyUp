import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { StudyResource, StudySession } from '@/api/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { TagSuggestionBox } from '@/components/primitives/TagSugestionBox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { DatePicker } from '@/components/primitives/DatePicker'
import { Textarea } from '@/components/ui/textarea'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { ResourcesSuggestionBox } from '@/components/primitives/ResourcesSuggestionBox'
import ResourceCard from '@/components/resources/Card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const schema = z.object({
  tagId: z.string({ error: 'Tag is required' }).min(1, 'Tag is required'),
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  startedAt: z.date(),
  durationMinutes: z
    .number({ error: 'Duration must be a number' })
    .min(1, 'Duration is required'),
  studyResources: z
    .array(
      z.object({
        resourceId: z.string(),
        label: z.string().optional(),
      }),
    )
    .default([]),
})
// ADD
export type SessionFormData = z.infer<typeof schema>

export default function SessionForm({
  open,
  setOpen,
  sessionData,
  onSubmit,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  sessionData?: {
    session?: StudySession
    resources?: Array<StudyResource>
  }
  onSubmit: (data: SessionFormData) => void
}) {
  console.log(sessionData)
  const form = useForm({
    mode: 'onSubmit', // TODO: work on onTouched
    resolver: zodResolver(schema),
    defaultValues: {
      title: sessionData?.session?.title || '',
      notes: sessionData?.session?.notes || '',
      tagId: sessionData?.session?.tagId || '',
      studyResources: sessionData?.resources || [],
      startedAt: sessionData?.session?.startedAt
        ? new Date(sessionData.session.startedAt)
        : new Date(),
      durationMinutes: sessionData?.session?.durationMinutes || 60,
    },
  })
  useEffect(() => {
    if (sessionData?.session) {
      form.reset({
        title: sessionData.session.title,
        notes: sessionData.session.notes ?? '',
        tagId: sessionData.session.tagId,
        studyResources: sessionData.resources ?? [],
        startedAt: new Date(sessionData.session.startedAt),
        durationMinutes: sessionData.session.durationMinutes,
      })
      setStudyResources(sessionData.resources ?? [])
    }
  }, [sessionData, form])
  const watchedResources = useWatch({
    control: form.control,
    name: 'studyResources',
  })
  const [studyResources, setStudyResources] = useState<Array<StudyResource>>(
    sessionData?.resources || [],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="min-w-20/21 md:min-w-3xl overflow-y-auto max-h-[calc(100vh-2rem)] ">
        <DialogHeader>
          <DialogTitle>
            {sessionData?.session ? 'Edit Session' : 'What did you learn?'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
          className="space-y-4"
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <Textarea
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? undefined : e.target.value,
                    )
                  }
                  id="notes"
                  placeholder="Add additional notes..."
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="tagId"
            control={form.control}
            render={({ field: { value, onChange }, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="tagId">Tag</FieldLabel>
                <TagSuggestionBox value={value} setValue={onChange} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="studyResources"
            control={form.control}
            render={({ field: { value, onChange }, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="studyResources">Resources</FieldLabel>
                <ResourcesSuggestionBox
                  value={value || []}
                  setValue={onChange}
                  setSelectedResources={setStudyResources}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <FieldGroup className="flex-col sm:flex-row gap-4 md:h-[100px] mt-0">
            <Controller
              name="startedAt"
              control={form.control}
              render={({ field: { onChange, value }, fieldState }) => (
                <Field>
                  <DatePicker
                    value={value}
                    onChange={onChange}
                    className="flex gap-2 justify-center sm:justify-start"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="durationMinutes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="mx-auto">
                  <FieldLabel htmlFor="durationMinutes">
                    Duration (minutes)
                  </FieldLabel>
                  <Input
                    type="number"
                    id="durationMinutes"
                    className="mx-auto"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    aria-invalid={fieldState.invalid}
                    value={field.value}
                    step={5}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          {studyResources.length > 0 && (
            <div className="mb-4 flex flex-col gap-2">
              <div className="text-lg font-semibold">Selected Resources</div>
              <div className="max-h-[300px] overflow-y-auto p-1 flex flex-col gap-2">
                {studyResources.map((resource) => (
                  <div
                    key={resource.resourceId}
                    className="flex flex-row gap-2"
                  >
                    <ResourceCard
                      resource={resource}
                      inSessionRemoveHandler={() => {
                        form.setValue(
                          'studyResources',
                          form
                            .getValues('studyResources')
                            ?.filter(
                              (r) => r.resourceId !== resource.resourceId,
                            ),
                        )
                        setStudyResources(
                          studyResources.filter(
                            (r) => r.resourceId !== resource.resourceId,
                          ),
                        )
                      }}
                      value={
                        watchedResources?.find(
                          (r) => r.resourceId === resource.resourceId,
                        )?.label || ''
                      }
                      setValue={(value) => {
                        form.setValue(
                          'studyResources',
                          watchedResources?.map((r) =>
                            r.resourceId === resource.resourceId
                              ? { ...r, label: value }
                              : r,
                          ),
                        )
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : sessionData?.session ? (
                'Save'
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
