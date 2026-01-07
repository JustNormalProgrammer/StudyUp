import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Navigate, useNavigate, useParams } from '@tanstack/react-router'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import type { Quiz } from '@/api/types'
import type { AxiosResponse } from 'axios'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { Switch } from '@/components/ui/switch'

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(255, 'Title is too long'),
  numberOfQuestions: z.number().min(1, 'Number of questions is required'),
  isMultipleChoice: z.boolean(),
  additionalInfo: z
    .string()
    .trim()
    .max(500, 'Additional information is too long')
    .optional(),
})

export type CreateQuizDialogForm = z.infer<typeof schema>

export default function CreateQuizDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { sessionId } = useParams({
    from: '/dashboard/study-sessions/$sessionId/',
  })
  const api = useAuthenticatedRequest()
  const navigate = useNavigate()
  const form = useForm<CreateQuizDialogForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      numberOfQuestions: 5,
      isMultipleChoice: false,
      additionalInfo: undefined,
    },
  })
  const mutation = useMutation({
    mutationFn: (data: CreateQuizDialogForm) => {
      setOpen(false)
      return api.post<Quiz>(`/sessions/${sessionId}/quizzes`, data)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-center">Create Quiz</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-6"
          noValidate
          onSubmit={form.handleSubmit((data) => {
            const promise = mutation.mutateAsync(data)
            toast.promise(promise, {
              loading: 'Creating quiz...',
              success: (response: AxiosResponse<Quiz>) => {
                return {
                  duration: 5000,
                  message: (
                    <div className="flex flex-row items-center gap-15">
                      <div className="flex-1 text-sm">
                        Quiz created successfully
                      </div>
                      <Button
                        variant="link"
                        className="p-0 text-muted-foreground gap-1"
                        onClick={() =>
                          navigate({
                            to: '/dashboard/quizzes/$quizId',
                            params: {
                              quizId: response.data.quizId,
                            },
                          })
                        }
                      >
                        View quiz
                      </Button>
                    </div>
                  ),
                }
              },
              error: 'Failed to create quiz. Please try again later.',
            })
          })}
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="numberOfQuestions"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-select-language">
                  Number of questions
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <Select
                  name={field.name}
                  value={field.value.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger
                    id="form-rhf-select-language"
                    aria-invalid={fieldState.invalid}
                    className="min-w-[120px]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {Array.from({ length: 10 }, (_, index) => index + 1).map(
                      (number) => (
                        <SelectItem key={number} value={number.toString()}>
                          {number}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="isMultipleChoice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" className="justify-start gap-3">
                <FieldLabel htmlFor="isMultipleChoice" className="max-w-fit">
                  Is multiple choice?
                </FieldLabel>
                <Switch
                  className="font-medium"
                  id="isMultipleChoice"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Field>
            )}
          />
          <Controller
            name="additionalInfo"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Additional information</FieldLabel>
                <Textarea
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? undefined : e.target.value,
                    )
                  }
                  className="break-all"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
