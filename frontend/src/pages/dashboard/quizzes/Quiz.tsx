import { useNavigate, useParams } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  BadgeQuestionMark,
  Calendar,
  Check,
  CheckCheck,
  Pencil,
  Trash,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type {
  QuizAttempt as QuizAttemptType,
  Quiz as QuizType,
} from '@/api/types'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

import { Button } from '@/components/ui/button'

import Tag from '@/components/primitives/Tag'
import QuizHeader from '@/components/quiz/QuizHeader'

export default function Quiz() {
  const { quizId } = useParams({
    from: '/dashboard/quizzes/$quizId/',
  })
  const navigate = useNavigate()
  const api = useAuthenticatedRequest()
  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data } = await api.get<QuizType>(`/quizzes/${quizId}`)
      return data
    },
  })
  const mutation = useMutation({
    mutationFn: (answers: Array<Array<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>>) => {
      return api.post<QuizAttemptType>(`/quizzes/${quizId}/attempts`, {
        userAttemptContent: answers,
      })
    },
  })
  const [answers, setAnswers] = useState<
    Array<Array<'A' | 'B' | 'C' | 'D' | 'E' | 'F'> | undefined>
  >([])
  const handleRadioChange = (
    questionIndex: number,
    choiceId: 'A' | 'B' | 'C' | 'D' | 'E' | 'F',
  ) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[questionIndex] = [choiceId] // tylko jedna odpowiedź
      return next
    })
  }

  const handleCheckboxChange = (
    questionIndex: number,
    choiceId: 'A' | 'B' | 'C' | 'D' | 'E' | 'F',
    checked: boolean,
  ) => {
    setAnswers((prev) => {
      const current = prev[questionIndex] ?? []
      const next = [...prev]

      next[questionIndex] = checked
        ? [...current, choiceId]
        : current.filter((c) => c !== choiceId)

      return next
    })
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const {data: attemptData} = await mutation.mutateAsync(
      answers as Array<Array<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>>,
      {
        onError: (error) => {
          toast.error('Failed to submit quiz')
        },
      },
    )
    navigate({
      to: '/dashboard/quizzes/$quizId/attempts/$attemptId',
      params: { quizId, attemptId: attemptData.quizAttemptId },
    })
  }
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div>Error</div>
  }
  if(!data) {
    return <div>No data</div>
  }
  return (
    <div className="flex flex-col max-w-7xl mx-auto gap-3 md:gap-10 border rounded-xl p-4">
      <QuizHeader
        title={data.title}
        tag={data.tag}
        numberOfQuestions={data.numberOfQuestions}
        isMultipleChoice={data.isMultipleChoice}
        createdAt={data.createdAt}
      />
      <div className="flex flex-col gap-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {data.quizContent.map((question) => {
            const questionIndex = question.questionNumber - 1
            const questionAnswers = answers[questionIndex] ?? []

            return (
              <div
                key={question.questionNumber}
                className="flex flex-col gap-3"
              >
                <p>
                  <span className="font-bold text-gray-600">
                    {question.questionNumber}.
                  </span>{' '}
                  {question.questionContent}
                </p>

                {/* SINGLE CHOICE */}
                {!question.isMultipleChoice && (
                  <RadioGroup
                    value={questionAnswers[0] ?? undefined}
                    onValueChange={(value) =>
                      handleRadioChange(
                        questionIndex,
                        value as 'A' | 'B' | 'C' | 'D' | 'E' | 'F',
                      )
                    }
                  >
                    {question.questionChoices.map((choice) => (
                      <div className="flex items-center gap-3" key={choice.id}>
                        <RadioGroupItem
                          value={choice.id}
                          id={`${question.questionNumber}-${choice.id}`}
                        />
                        <Label
                          htmlFor={`${question.questionNumber}-${choice.id}`}
                        >
                          {choice.content}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {/* MULTIPLE CHOICE */}
                {question.isMultipleChoice && (
                  <>
                    {question.questionChoices.map((choice) => {
                      const checked = questionAnswers.includes(
                        choice.id,
                      )

                      return (
                        <div
                          className="flex items-center gap-3"
                          key={choice.id}
                        >
                          <Checkbox
                            id={`${question.questionNumber}-${choice.id}`}
                            checked={checked}
                            onCheckedChange={(value) =>
                              handleCheckboxChange(
                                questionIndex,
                                choice.id,
                                Boolean(value),
                              )
                            }
                          />
                          <Label
                            htmlFor={`${question.questionNumber}-${choice.id}`}
                          >
                            {choice.content}
                          </Label>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            )
          })}

          <Button
            type="submit"
            className="w-full"
            disabled={
              answers.length !== data.numberOfQuestions ||
              answers.some((answer) => !answer || answer.length === 0)
            }
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
