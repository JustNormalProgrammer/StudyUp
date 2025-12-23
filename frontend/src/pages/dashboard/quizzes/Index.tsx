import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  BadgeQuestionMark,
  BookOpen,
  Calendar,
  Check,
  CheckCheck,
} from 'lucide-react'
import type { Quiz } from '@/api/types'
import Tag from '@/components/primitives/Tag'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { hexToRgba } from '@/utils/hexToRgba'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function Quizzes() {
  const navigate = useNavigate()
  const api = useAuthenticatedRequest()
  const { data, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data } =
        await api.get<Array<Omit<Quiz, 'quizContent'>>>('/quizzes')
      return data
    },
  })
  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      {data?.map((quiz) => (
        <Link
          to="/dashboard/quizzes/$quizId"
          params={{ quizId: quiz.quizId }}
          key={quiz.quizId}
        >
          <Card
            className="relative overflow-hidden py-4 hover:shadow-md  transition-all duration-200 hover:bg-(--tag-color)"
            style={{
              ['--tag-color' as any]: hexToRgba(quiz.tag.color, 0.02),
            }}
          >
            <div
              className="absolute top-0 left-0 h-full w-2"
              style={{ backgroundColor: quiz.tag.color }}
            ></div>
            <CardContent className="flex flex-row items-center gap-5">
              <div className="flex flex-col gap-2 w-2xl">
                <CardTitle className="text-sm text-ellipsis overflow-hidden line-clamp-1">
                  {quiz.title}
                </CardTitle>
              </div>
              <Tag tag={quiz.tag} className="cursor-pointer hidden md:flex" />
              <div className="flex flex-row gap-2 w-20 md:justify-start  md:gap-6 ml-auto min-w-fit">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex flex-row gap-1 items-center w-10">
                      <BadgeQuestionMark className="w-4 h-4" />
                      <div className="text-xs text-gray-600 ">
                        {quiz.numberOfQuestions}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of questions</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex flex-row gap-1 items-center">
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
                <div className="flex flex-row gap-1 items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault()
                          navigate({
                            to: '/dashboard/study-sessions/$sessionId',
                            params: { sessionId: quiz.sessionId },
                          })
                        }}
                      >
                        <BookOpen />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View session</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
