import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { HexColorPicker } from 'react-colorful'
import axios from 'axios'
import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import Tag from '../primitives/Tag'
import type { UseMutationResult } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import type { Tag as TagType } from '@/api/types'

const schema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(50, 'Tag cannot exceed 50 characters'),
  color: z.string().min(1, 'Color is required'),
})

export type CreateTagForm = z.infer<typeof schema>

export default function TagDialog({
  open,
  setOpen,
  tag,
  mutation,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  tag?: TagType
  mutation: UseMutationResult<
    AxiosResponse<any, any, {}>,
    Error,
    {
      content: string
      color: string
    },
    unknown
  >
}) {
  const queryClient = useQueryClient()
  const form = useForm<CreateTagForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: tag?.content || 'example',
      color: tag?.color || '#80E5B5',
    },
  })
  useEffect(() => {
    form.reset({
      content: tag?.content || 'example',
      color: tag?.color || '#80E5B5',
    })
  }, [tag])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-xs">
        <DialogHeader>
          <DialogTitle>{tag ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
        </DialogHeader>
        <Tag
          tag={{
            content: form.watch('content') || 'example',
            color: form.watch('color'),
          }}
          className="mx-auto max-w-full text-ellipsis overflow-hidden"
        />
        <form
          onSubmit={form.handleSubmit(async(data) =>
            await mutation.mutate(data, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['tags'] })
                setOpen(false)
              },
              onError: (error) => {      
                console.log(error)
                if (axios.isAxiosError(error) && error.response?.status === 400) {
                  const serverErrors: Array<{ path: 'content' | 'color'; msg: string }> =
                    error.response.data?.errors
                  serverErrors.forEach((error) => {
                    form.setError(error.path, {
                      type: 'server',
                      message: error.msg,
                    })
                  })
                  return
                }
                toast.error('Failed to create tag')
              },
            }),
          )}
          className="space-y-6"
        >
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="content">Content</FieldLabel>
                <Input
                  {...field}
                  id="content"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="color"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Color</FieldLabel>
                <HexColorPicker
                  color={field.value}
                  onChange={field.onChange}
                  className="mx-auto"
                  style={{ width: '100%' }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : tag ? (
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
