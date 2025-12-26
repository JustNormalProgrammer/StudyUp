import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Label as RechartsLabel,
} from 'recharts'
import type { Quiz, QuizAttempt } from '@/api/types'
import type { ChartConfig } from '@/components/ui/chart'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import QuizHeader from '@/components/quiz/QuizHeader'
import { ChartContainer } from '@/components/ui/chart'
import { getColor } from '@/utils/utilFunc'

export default function Attempt() {
  const { quizId, attemptId } = useParams({
    from: '/dashboard/quizzes/$quizId/attempts/$attemptId',
  })

  const api = useAuthenticatedRequest()

  const attemptQuery = useQuery({
    queryKey: ['attempt', attemptId],
    queryFn: async () => {
      const { data } = await api.get<QuizAttempt>(
        `/quizzes/attempts/${attemptId}`,
      )
      return data
    },
  })

  const quizQuery = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data } = await api.get<Quiz>(`/quizzes/${quizId}`)
      return data
    },
  })
  const percentage = Math.round(
    (Number(attemptQuery.data?.score) / Number(quizQuery.data?.maxScore)) * 100,
  )


  const chartData = [
    {
      name: 'score',
      value: percentage,
      fill: getColor(percentage),
    },
  ]
  const chartConfig = {
    score: {
      label: 'Wynik',
    },
  } satisfies ChartConfig

  if (attemptQuery.isLoading || quizQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (attemptQuery.error || quizQuery.error) {
    return <div>Error</div>
  }

  if (!attemptQuery.isSuccess || !quizQuery.isSuccess) {
    return null
  }

  return (
    <div className="flex flex-col max-w-7xl mx-auto gap-3 md:gap-10 border rounded-xl p-4">
      <QuizHeader
        title={quizQuery.data.title}
        tag={quizQuery.data.tag}
        numberOfQuestions={quizQuery.data.numberOfQuestions}
        isMultipleChoice={quizQuery.data.isMultipleChoice}
        createdAt={attemptQuery.data.finishedAt}
      />
      <div className="flex flex-row items-center justify-center gap-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-[100px] w-fit"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius={40}
            outerRadius={55}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              polarRadius={[40, 30]}
              className="fill-"
            />

            <RadialBar dataKey="value" background cornerRadius={10} />

            <PolarRadiusAxis tick={false} axisLine={false}>
              <RechartsLabel
                content={({ viewBox }) => {
                  if (!viewBox || !('cx' in viewBox)) return null

                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-xl font-semibold"
                    >
                        {percentage}%
                    </text>
                  )
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </div>
      <div className="flex flex-col gap-6">
        {quizQuery.data.quizContent.map((question) => {
          const attempt =
            attemptQuery.data.userAttemptContent[question.questionNumber - 1]

          return (
            <div key={question.questionNumber} className="flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <p>
                  <span className="font-bold ">{question.questionNumber}.</span>{' '}
                  {question.questionContent}
                </p>
                <div
                  className={`w-fit self-start p-1 rounded-sm ${attempt.isCorrect ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}
                >
                  <p className="text-sm text-nowrap">
                    {attempt.score}/{attempt.maxScore}
                  </p>
                </div>
              </div>
              {!question.isMultipleChoice && (
                <RadioGroup value={attempt.userAnswers[0]}>
                  {question.questionChoices.map((choice) => {
                    const isChecked = attempt.userAnswers[0] === choice.id
                    return (
                      <div
                        key={choice.id}
                        className={`flex items-center gap-3 cursor-default ${attempt.correctAnswers[0] === choice.id && 'text-green-600'} ${attempt.correctAnswers[0] !== choice.id && isChecked && 'text-red-600'}`}
                      >
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
                    )
                  })}
                </RadioGroup>
              )}
              {question.isMultipleChoice && (
                <>
                  {question.questionChoices.map((choice) => {
                    const isChecked = attempt.userAnswers.includes(choice.id)
                    return (
                      <div
                        key={choice.id}
                        className={`flex items-center gap-3 cursor-default  ${attempt.correctAnswers.includes(choice.id) && 'text-green-600'} ${!attempt.correctAnswers.includes(choice.id) && isChecked && 'text-red-600'}`}
                      >
                        <Checkbox
                          id={`${question.questionNumber}-${choice.id}`}
                          checked={isChecked}
                          className="cursor-default"
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
      </div>
    </div>
  )
}
