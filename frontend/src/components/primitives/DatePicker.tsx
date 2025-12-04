'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { TimePicker } from './TimePicker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function DatePicker({
  onChange,
  value,
  className,
}: {
  onChange: (date: Date) => void
  value: Date
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const time = value.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  console.log(time)
  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="date-picker" className="h-[20px]">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {value.toLocaleDateString()}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return
                setOpen(false)
                onChange(date)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="time-picker" className="px-1 h-[20px]">
          Time
        </Label>
        <TimePicker
          id="time-picker"
          value={time}
          onChange={(time) => {
            const [hours, minutes] = time.split(':').map(Number)

            const updated = new Date(value)
            updated.setHours(hours)
            updated.setMinutes(minutes)

            onChange(updated)
          }}
        />
      </div>
    </div>
  )
}
