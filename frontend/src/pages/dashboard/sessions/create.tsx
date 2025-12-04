import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import type { StudyResource } from '@/api/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

const schema = z.object({
  tagId: z.string({ error: 'Tag is required' }).min(1, 'Tag is required'),
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  startedAt: z.date(),
  durationMinutes: z
    .number({ error: 'Duration must be a number' })
    .min(1, 'Duration is required'),
  studyResources: z.array(z.object({
    resourceId: z.string(),
    label: z.string().optional(),
  })).default([]),
})
// ADD
export default function CreateSession() {
  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      notes: '',
      startedAt: new Date(),
      durationMinutes: 60,
    },
  })
  const api = useAuthenticatedRequest()
  const mutation = useMutation({
    mutationFn: (newSession: z.infer<typeof schema>) => {
      return api.post('/sessions', newSession)
    },
    onError: (error) => {
      console.log(error)
    },
  })
  const [formError, setFormError] = useState<string>('')
  const [studyResources, setStudyResources] = useState<Array<StudyResource>>([])
  console.log(form.getValues())

  return (
    <div className="min-h-screen flex justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-xl self-start mt-20 gap-2">
        <CardHeader className="text-xl font-semibold">
          What did you learn?
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
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
                  <div key={resource.resourceId} className="flex flex-row gap-2">
                    <ResourceCard
                      resource={resource}
                      inSessionRemoveHandler={() => {
                        form.setValue(
                          'studyResources',
                          form
                            .getValues('studyResources')
                            ?.filter((r) => r.resourceId !== resource.resourceId),
                        )
                        setStudyResources(
                          studyResources.filter(
                            (r) => r.resourceId !== resource.resourceId,
                          ),
                        )
                      }}
                    />
                    <Input
                      name="label"
                      className='min-w-12 flex-1 h-auto p-1 text-xs'
                      placeholder='eg. 1-5'
                      value={form.watch('studyResources')?.find((r) => r.resourceId === resource.resourceId)?.label || ''}
                      onChange={(e) => {
                        form.setValue(
                          'studyResources',
                          form.watch('studyResources')?.map((r) => r.resourceId === resource.resourceId ? { ...r, label: e.target.value } : r),
                        )
                      }}
                    />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
