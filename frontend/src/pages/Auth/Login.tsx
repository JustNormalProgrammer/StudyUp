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

export interface LoginResponse extends User {
  accessToken: string
}

const schema = z.object({
  email: z.email('Email is invalid').max(255, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(256, 'Password is too long'),
})

type LoginForm = z.infer<typeof schema>

export default function Login() {
  const form = useForm<LoginForm>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [formError, setFormError] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', data)
      login(response.data)
      navigate({ to: '/dashboard' })
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        setFormError('Unexpected error occurred')
        return
      }
      if (e.response?.status === 400) {
        const resErrors = e.response.data?.errors
        if (Array.isArray(resErrors) && resErrors.length > 0) {
          resErrors.forEach((error: ExpressValidatorError) => {
            form.setError(error.path as 'email' | 'password', {
              type: 'server',
              message: error.msg,
            })
          })
          return
        }
      }
      if (e.response?.status === 401) {
        setFormError('Username or password is invalid')
        return
      }
      setFormError('Unexpected network error occurred')
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md self-start mt-20 gap-2">
        <CardHeader>
          <CardTitle className="text-2xl">Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
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
                    type="email"
                    placeholder="email@example.com"
                    aria-invalid={fieldState.invalid}
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
                      placeholder="password"
                      aria-invalid={fieldState.invalid}
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

              <a href="#" className="text-sm underline">
                Forgot password?
              </a>
            </div>
            {formError && (
              <div className="flex justify-center items-center gap-1.5 text-md text-red-600">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : (
                'Log in'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center text-sm">
          <span>Don't have an account?</span>
          <Button variant="link" className="text-sm p-2" asChild>
            <Link to="/register">Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
