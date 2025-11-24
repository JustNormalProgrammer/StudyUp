import { useState } from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { z } from 'zod'
import type { SubmitHandler } from 'react-hook-form'
import type { User } from '@/contexts/AuthProvider'
import type { ExpressValidatorError } from '@/types'
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

export interface RegisterResponse extends User {
  accessToken: string
}
const schema = z
  .object({
    email: z.email('Email is invalid').max(255, 'Email is too long'),
    username: z.string().min(1, "Username is required").max(100, 'Username is too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(256, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormFields = z.infer<typeof schema>
export default function Register() {
  const form = useForm({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  })
  const [formError, setFormError] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const reponse = await api.post<RegisterResponse>('/auth/register', data)
      login(reponse.data)
      navigate({ to: '/dashboard' })
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        setFormError('Unexpected error occurred.')
        return
      }
      if (e.response?.status === 400) {
        const resErrors = e.response.data?.errors
        if (Array.isArray(resErrors) && resErrors.length > 0) {
          resErrors.forEach((error: ExpressValidatorError) => {
            form.setError(error.path as 'username' | 'password' | 'email', {
              type: 'server',
              message: error.msg,
            })
          })
          return
        }
        setFormError('Unexpected network error occurred.')
        return
      }
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-slate-50 p-">
      <Card className="w-full max-w-md self-start mt-20 gap-2">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
            onChange={() => setFormError('')}
            noValidate
          >
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="email@example.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="username"
                    aria-invalid={fieldState.invalid}
                    placeholder="your username"
                    autoComplete="username"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      aria-invalid={fieldState.invalid}
                      placeholder="password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      aria-invalid={fieldState.invalid}
                      placeholder="confirm password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="flex items-center justify-between mt-5">
              <label className="flex items-center gap-2">
                <Checkbox id="remember" />
                <span className="text-sm">Remember me</span>
              </label>
            </div>
            {formError && (
              <div className="flex items-center justify-center mb-0 gap-1.5 text-md text-red-600">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner />
                    ...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center text-sm">
          <span>Already have an account?</span>
          <Button variant="link" className="text-sm p-2" asChild>
            <Link to="/login">Log in</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
