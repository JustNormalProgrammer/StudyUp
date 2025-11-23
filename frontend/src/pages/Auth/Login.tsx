import React, { useState } from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'

export interface LoginForm {
  email: string
  password: string
}

export default function LoginCard() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>()
  const [formError, setFormError] = useState<string | null>(
    'Email or password is incorrect',
  )
  const [showPassword, setShowPassword] = useState(false)
  const onSubmit: SubmitHandler<LoginForm> = (data) => console.log(data)

  return (
    <div className="min-h-screen flex justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md self-start mt-20 gap-2">
        <CardHeader>
          <CardTitle className="text-2xl">Zaloguj się</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            onChange={() => setFormError(null)}
            noValidate
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: 'Invalid email address',
                  },
                  maxLength: { value: 255, message: 'Email is too long' },
                })}
                aria-invalid={!!errors.email}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Hasło</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 1,
                      message: 'Password is required',
                    },
                    maxLength: {
                      value: 256,
                      message: 'Password is too long',
                    },
                  })}
                  aria-invalid={!!errors.password}
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
              {errors.password && (
                <p className="text-sm text-destructive mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <Checkbox id="remember" />
                <span className="text-sm">Zapamiętaj mnie</span>
              </label>
              <a href="#" className="text-sm underline">
                Zapomniałeś hasła?
              </a>
            </div>
            {formError && (
              <div className="flex items-center justify-center mb-0 gap-1.5 text-md text-red-600">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}
            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Logowanie...
                  </>
                ) : (
                  'Zaloguj się'
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center text-sm">
          <span>Nie masz konta?</span>
          <Button variant="link" className="text-sm p-2" asChild>
            <Link to="/register">Zarejestruj się</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
