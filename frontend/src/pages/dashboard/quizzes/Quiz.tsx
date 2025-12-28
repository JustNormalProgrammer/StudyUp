import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Calendar, CircleX } from 'lucide-react'
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

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Tag from '@/components/primitives/Tag'
import QuizHeader from '@/components/quiz/QuizHeader'
import { getColor } from '@/utils/utilFunc'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function Quiz() {
  const { quizId } = useParams({
    from: '/dashboard/quizzes/$quizId/',
  })
  const [showAttempts, setShowAttempts] = useState(false)
  const handleShowAttempts = () => {
    setShowAttempts(!showAttempts)
  }
  const navigate = useNavigate()
  const api = useAuthenticatedRequest()
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data } = await api.get<QuizType>(`/quizzes/${quizId}`)
      return data
    },
  })
  const {
    data: attemptsData,
    isLoading: attemptsLoading,
    error: attemptsError,
    isSuccess: attemptsSuccess,
  } = useQuery({
    queryKey: ['attempt', quizId],
    queryFn: async () => {
      const { data } = await api.get<
        Array<{ quizAttemptId: string; score: number; finishedAt: string }>
      >(`/quizzes/${quizId}/attempts`)
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
    const { data: attemptData } = await mutation.mutateAsync(
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
  if (isLoading || attemptsLoading) {
    return <div>Loading...</div>
  }
  if (error || attemptsError) {
    return <div>Error</div>
  }
  if (!isSuccess || !attemptsSuccess) {
    return <div>No data</div>
  }
  return (
    <div className="flex flex-col max-w-7xl mx-auto gap-3 md:gap-10 border rounded-xl p-4">
      <div className="flex flex-col gap-3">
        <QuizHeader
          title={data.title}
          tag={data.tag}
          numberOfQuestions={data.numberOfQuestions}
          isMultipleChoice={data.isMultipleChoice}
          createdAt={data.createdAt}
          ContextButton={
            <Button
              variant="link"
              className="p-0 text-muted-foreground"
              onClick={(e) => {
                e.preventDefault()
                navigate({
                  to: '/dashboard/study-sessions/$sessionId',
                  params: { sessionId: data.sessionId },
                })
              }}
            >
              Session
            </Button>
          }
        />
        <Accordion
          type="single"
          collapsible
          className="border rounded-xl px-2 py-0 bg-muted/5"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="cursor-pointer justify-start gap-1">
              Show previous attempts
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea>
                <div className="flex flex-row items-center w-full overflow-x-auto gap-4 pb-4">
                  {attemptsData.length === 0 && (
                    <div className="text-sm text-muted-foreground font-medium flex flex-row items-center gap-1">
                      <CircleX className="size-4" />
                      No previous attempts found
                    </div>
                  )}
                  {attemptsData.map((attempt) => {
                    const percent =
                      (Number(attempt.score) / Number(data.maxScore)) * 100

                    return (
                      <Link
                        to="/dashboard/quizzes/$quizId/attempts/$attemptId"
                        params={{ quizId, attemptId: attempt.quizAttemptId }}
                      >
                        <div
                          key={attempt.quizAttemptId}
                          className="
                        flex flex-col justify-between
                        md:w-[150px] rounded-xl border
                        bg-(--score-color)/10
                        border-(--score-color)/30
                        p-2 transition cursor-pointer
                        hover:shadow-md
                      "
                          style={{
                            ['--score-color' as any]: getColor(percent),
                          }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <p className="text-sm text-muted-foreground">
                              Wynik
                            </p>
                            <p
                              className="text-xl font-semibold"
                              style={{ color: 'var(--score-color)' }}
                            >
                              {Number(percent.toFixed(2))}%
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(
                                attempt.finishedAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

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
                      const checked = questionAnswers.includes(choice.id)

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
