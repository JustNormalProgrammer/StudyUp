import { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import interactionPlugin from '@fullcalendar/interaction'
import type { UserEventResponse } from '@/api/types'
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

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null)
  const { open } = useSidebar()
  const api = useAuthenticatedRequest()
  const [currentDate, setCurrentDate] = useState('')

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<Array<any>>([])

  const { data, isLoading, error } = useQuery({
    queryKey: ['userEvents'],
    queryFn: async () => {
      const { data } = await api.get<UserEventResponse>('/user-events')
      return data
    },
    select: (data) => {
      const sessionsEvents = data.userSessions.map((session) => ({
        title: session.title,
        date: session.startedAt,
        allDay: true,
        color: session.tag.color,
      }))
      const quizzesAttemptsEvents = data.userQuizzesAttempts.map((attempt) => {
        console.log(attempt.finishedAt)
        console.log('data', new Date(attempt.finishedAt).toISOString())
        return {
          title: attempt.quizTitle,
          date: attempt.finishedAt,
          allDay: true,
          color: attempt.tag.color,
        }
      })

      return [...sessionsEvents, ...quizzesAttemptsEvents]
    },
  })
  console.log(selectedEvents)

  useEffect(() => {
    const api = calendarRef.current?.getApi()
    if (!api) return
    const timeout = setTimeout(() => api.updateSize(), 250)
    return () => clearTimeout(timeout)
  }, [open])

  function handlePrev() {
    calendarRef.current?.getApi().prev()
  }

  function handleNext() {
    calendarRef.current?.getApi().next()
  }

  function handleToday() {
    calendarRef.current?.getApi().today()
  }

  function handleDateClick(info: any) {
    const clickedDate = info.dateStr
    const dayEvents =
      data?.filter((event) => event.date.split('T')[0] === clickedDate) ?? []

    setSelectedDate(clickedDate)
    setSelectedEvents(dayEvents)
    setDialogOpen(true)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <div className="overflow-y-hidden">
        <div className="flex flex-col mb-4 gap-2 justify-center items-center md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              className="px-3"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>

            <div className="text-center font-semibold text-lg select-none sm:text-base">
              {currentDate}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="px-3"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="px-3"
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
            weekends={true}
            height="80vh"
            handleWindowResize={true}
            events={data}
            headerToolbar={false}
            dayMaxEventRows={true}
            displayEventTime={false}
            dateClick={handleDateClick}
            datesSet={(arg) => setCurrentDate(arg.view.title)}
          />
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Events on {selectedDate}</DialogTitle>
          </DialogHeader>
          {selectedEvents.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {selectedEvents.map((event, index) => (
                <li
                  key={index}
                  className={`p-2 border-2 rounded-md`}
                  style={{
                    borderColor: event.color,
                    backgroundColor: hexToRgba(event.color, 0.05),
                  }}
                >
                  {event.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground mt-3">
              No events on this day.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
