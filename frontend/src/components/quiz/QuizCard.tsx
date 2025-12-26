import { BadgeQuestionMark, BookOpen, Check, CheckCheck } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Card, CardTitle } from '../ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

import { Button } from '../ui/button'
import type { QuizInfo } from '@/api/types'

export default function QuizCard({ quiz }: { quiz: QuizInfo }) {
  return (
    <Link to="/dashboard/quizzes/$quizId" params={{ quizId: quiz.quizId }}>
      <Card className="flex flex-row p-4 gap-7 items-center flex-9 overflow-hidden box-border relative cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-black/5">
        <CardTitle>{quiz.title}</CardTitle>
        <div className="flex flex-row gap-2 w-20 md:justify-start  md:gap-6 ml-auto min-w-fit">
          <Tooltip>
            <TooltipTrigger>
              <div className="flex flex-row gap-1.5 items-center w-10">
                <BadgeQuestionMark className="w-4 h-4" />
                <div className="text-sm text-gray-600 ">
                  {quiz.numberOfQuestions}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Number of questions</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex flex-row gap-1 w-5 items-center">
            <Tooltip>
              <TooltipTrigger>
                {quiz.isMultipleChoice ? (
                  <CheckCheck className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {quiz.isMultipleChoice
                    ? 'Multiple Choice Quiz'
                    : 'Single Choice Quiz'}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Card>
    </Link>
  )
}
