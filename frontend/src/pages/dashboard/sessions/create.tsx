import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { z } from 'zod'
import type { SubmitHandler } from 'react-hook-form'
import type { User } from '@/contexts/AuthProvider'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/contexts/AuthProvider'
import { api } from '@/api/api'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { DatePicker } from '@/components/primitives/DatePicker'

const schema = z.object({
  tagId: z.string().min(1, 'Tag is required'),
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  startedAt: z.date(),
  durationMinutes: z.number().min(1, 'Duration is required'),
})

export default function CreateSession() {
  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      notes: '',
      startedAt: new Date(),
      durationMinutes: 0,
    },
  })
  const [formError, setFormError] = useState<string>('')

  return (
    <div className="min-h-screen flex justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md self-start mt-20 gap-2">
        <CardHeader>What did you learn?</CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(() => console.log('submit'))}
            className="space-y-4"
          >
            <Controller
              name="tagId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="tagId">Tag</FieldLabel>
                  <Input
                    {...field}
                    id="tagId"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
                  <textarea
                    {...field}
                    id="notes"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <DatePicker label="Started At" />
            <Controller
              name="durationMinutes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="durationMinutes">
                    Duration (minutes)
                  </FieldLabel>

                  <Input
                    type="number"
                    id="durationMinutes"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit">Create</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
