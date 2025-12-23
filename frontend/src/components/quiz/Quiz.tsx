import { useState } from 'react'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import type { Quiz as QuizType } from '@/api/types'

export default function Quiz({
  quizData,
}: {
  quizData: QuizType
}) {
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
  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex flex-col gap-6"
      >
        {quizData.quizContent.map((question) => {
          const questionIndex = question.questionNumber - 1
          const questionAnswers = answers[questionIndex] ?? []

          return (
            <div key={question.questionNumber} className="flex flex-col gap-3">
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
                      <div className="flex items-center gap-3" key={choice.id}>
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
      </div>
    </div>
  )
}
