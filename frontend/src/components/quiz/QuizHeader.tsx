import {
  BadgeQuestionMark,
  Calendar,
  Check,
  CheckCheck,
  Pencil,
  Trash,
} from 'lucide-react'
import { Tooltip, TooltipTrigger } from '@radix-ui/react-tooltip'
import { Button } from '../ui/button'
import { TooltipContent } from '../ui/tooltip'
import Tag from '../primitives/Tag'
import type { Tag as TagType } from '@/api/types'

export default function QuizHeader({
  title,
  tag,
  numberOfQuestions,
  isMultipleChoice,
  createdAt,
  ContextButton
}: {
  title: string
  tag: TagType
  numberOfQuestions: number
  isMultipleChoice: boolean
  createdAt: string
  ContextButton?: React.ReactNode
}) {
  return (
    <>
      <div className="flex flex-row justify-between gap-1 items-center flex-wrap">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {ContextButton}
      </div>
      <div className="flex flex-row gap-5 items-center flex-wrap justify-between">
        <div className="flex flex-row gap-5 items-center flex-wrap">
          <Tag tag={tag} />
          <div className="flex gap-1 items-center">
            <BadgeQuestionMark className="w-4 h-4" />
            <p className="text-sm text-gray-600 whitespace-nowrap">
              {numberOfQuestions} questions
            </p>
          </div>
          <div className="flex gap-1 items-center">
            {isMultipleChoice ? (
              <CheckCheck className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <p className="text-sm text-gray-600 whitespace-nowrap">
              {isMultipleChoice ? 'Multiple Choice' : 'Single Choice'}
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <Calendar className="w-4 h-4" />
            <p className="text-sm text-gray-600 whitespace-nowrap">
              {new Date(createdAt).toLocaleString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2  md:gap-4 self-end ">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setOpen(true)}
                className="w-fit"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon" className="w-fit">
                <Trash className="w-4 h-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  )
}
