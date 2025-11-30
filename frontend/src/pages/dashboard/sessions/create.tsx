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

const schema = z.object({
    tagId: z.string().min(1, 'Tag is required'),
    title: z.string().min(1, 'Title is required'),
    notes: z.string().optional(),
    startedAt: z.date(),
    durationMinutes: z.number().min(1, 'Duration is required'),
});

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

}
