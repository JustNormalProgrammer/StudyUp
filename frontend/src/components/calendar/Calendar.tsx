import { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
  BookOpenIcon,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Hourglass,
  MessageCircleQuestionMark,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Link, useNavigate } from '@tanstack/react-router'
import Tag from '../primitives/Tag'
import DateEvent from './DateEvent'
import Event from './Event'
import type { Tag as TagType } from '@/api/types'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import useAuthenticatedRequest from '@/hooks/useAuthenticatedRequest'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { hexToRgba } from '@/utils/hexToRgba'
import { Separator } from '@/components/ui/separator'
import '@/components/calendar/styles.css'
import { getColor } from '@/utils/utilFunc'

type CalendarEvent = {
  title: string
  start: string
  allDay: boolean
  colorBorder: string
  type: 'session' | 'quiz'
  extendedProps: {
    sessionId?: string
    attemptId?: string
    score?: string
    quizId?: string
    durationMinutes?: number
    tag?: TagType
    maxScore?: number
  }
}

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null)
  const { open } = useSidebar()
  const api = useAuthenticatedRequest()
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<Array<any>>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentMonthTitle, setCurrentMonthTitle] = useState('')
  const [range, setRange] = useState<{ start: string; end: string } | null>(
    null,
  )

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery<{
    sessions: Array<CalendarEvent>
    quizzes: Array<CalendarEvent>
  }>({
    queryKey: ['calendar-events', range],
    enabled: !!range,
    queryFn: async () => {
      const response = await api.get('/user-events', {
        params: {
          from: range!.start,
          to: range!.end,
        },
      })

      const data = response.data

      const sessionsEvents: Array<CalendarEvent> = data.userSessions.map(
        (session: any) => ({
          title: session.title,
          start: session.startedAt,
          allDay: true,
          colorBorder: session.tag.color,
          type: 'session',
          extendedProps: {
            sessionId: session.sessionId,
            durationMinutes: session.durationMinutes,
            tag: session.tag,
          },
        }),
      )

      const quizzesAttemptsEvents: Array<CalendarEvent> =
        data.userQuizzesAttempts.map((attempt: any) => ({
          title: attempt.quizTitle,
          start: attempt.finishedAt,
          allDay: true,
          colorBorder: attempt.tag.color,
          type: 'quiz',
          extendedProps: {
            attemptId: attempt.quizAttemptId,
            score: attempt.score,
            quizId: attempt.quizId,
            tag: attempt.tag,
            maxScore: attempt.maxScore,
          },
        }))
      console.log('sessions:', sessionsEvents)
      return { sessions: sessionsEvents, quizzes: quizzesAttemptsEvents }
    },
  })

  function renderEventContent(eventInfo: any) {
    return <Event event={eventInfo.event} />
  }

  function handleDateClick(info: any) {
    setSelectedDate(info.date.toDateString())
    setDialogOpen(true)
  }
  function handleEventClick(info: any) {
    if (info.event.extendedProps.type === 'session') {
      navigate({
        to: '/dashboard/study-sessions/$sessionId',
        params: { sessionId: info.event.extendedProps.sessionId! },
      })
    } else {
      navigate({
        to: '/dashboard/quizzes/$quizId/attempts/$attemptId',
        params: {
          quizId: info.event.extendedProps.quizId!,
          attemptId: info.event.extendedProps.attemptId!,
        },
      })
    }
  }
  const sessions = events?.sessions ?? []
  const quizzes = events?.quizzes ?? []

  const sessionsForDate = sessions.filter(
    (session) => new Date(session.start).toDateString() === selectedDate,
  )
  const quizzesForDate = quizzes.filter(
    (quiz) => new Date(quiz.start).toDateString() === selectedDate,
  )
  console.log('sessionsForDate:', sessionsForDate)
  console.log('quizzesForDate:', quizzesForDate)
  return (
    <>
      <div className="overflow-y-hidden">
        <div className="flex flex-col mb-4 gap-2 justify-center items-center md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => calendarRef.current?.getApi().prev()}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>

            <div className="text-center font-semibold text-lg select-none">
              {currentMonthTitle}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => calendarRef.current?.getApi().next()}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => calendarRef.current?.getApi().today()}
          >
            <CalendarIcon className="mr-1 h-4 w-4" />
            Today
          </Button>
        </div>

        <div className="shadow-sm bg-white">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="80vh"
            headerToolbar={false}
            events={[...sessions, ...quizzes]}
            displayEventTime={false}
            eventDisplay="block"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            datesSet={(arg) => {
              setCurrentMonthTitle(arg.view.title)
              setRange({
                start: arg.startStr,
                end: arg.endStr,
              })
            }}
          />
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mx-auto">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString('pl-PL')
                : ''}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <BookOpenIcon className="h-4 w-4" />
                <div className="text-md font-medium">Sessions</div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                {sessionsForDate.length === 0 ? (
                  <div className="text-sm text-gray-600">
                    No sessions found for this date
                  </div>
                ) : (
                  sessionsForDate.map((session) => (
                    <Link
                      to="/dashboard/study-sessions/$sessionId"
                      params={{ sessionId: session.extendedProps.sessionId! }}
                      key={session.extendedProps.sessionId}
                    >
                      <DateEvent
                        title={session.title}
                        colorBorder={session.colorBorder}
                        secInfo={
                          <div className="flex flex-row items-center gap-5">
                            <Tag tag={session.extendedProps.tag!} size="sm" />
                            <div className="flex flex-row items-center gap-1">
                              <Hourglass className="w-3 h-4" />
                              <span className="text-xs text-gray-600">
                                {session.extendedProps.durationMinutes} mins
                              </span>
                            </div>
                          </div>
                        }
                      />
                    </Link>
                  ))
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <MessageCircleQuestionMark className="h-4 w-4" />
                <div className="text-md font-medium">Quiz attempts</div>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                {quizzesForDate.length === 0 && (
                  <div className="text-sm text-gray-600">
                    No quiz attempts found for this date
                  </div>
                )}
                {quizzesForDate.map((quiz) => {
                  const percent =
                    (Number(quiz.extendedProps.score) / Number(quiz.extendedProps.maxScore)) * 100
                  return (
                    <Link
                      to="/dashboard/quizzes/$quizId/attempts/$attemptId"
                      params={{
                        quizId: quiz.extendedProps.quizId!,
                        attemptId: quiz.extendedProps.attemptId!,
                      }}
                      key={quiz.extendedProps.attemptId}
                    >
                      <DateEvent
                        title={quiz.title}
                        colorBorder={quiz.colorBorder}
                        secInfo={
                          <div className="flex flex-row items-center gap-5">
                            <Tag tag={quiz.extendedProps.tag!} size="sm" />
                            <div
                              className="text-xs font-semibold bg-(--score-color)/10 px-2 py-1 rounded-md"
                              style={{
                                ['--score-color' as any]: getColor(
                                  percent,
                                ),
                              }}
                            >
                              {quiz.extendedProps.score} / {quiz.extendedProps.maxScore}
                            </div>
                          </div>
                        }
                      />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
