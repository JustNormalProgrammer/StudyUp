import { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import interactionPlugin from '@fullcalendar/interaction'
import { toast } from 'sonner'
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
import '@/components/calendar/styles.css'

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null)
  const { open } = useSidebar()
  const api = useAuthenticatedRequest()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<Array<any>>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentMonthTitle, setCurrentMonthTitle] = useState<string>('')

  async function fetchEvents(
    fetchInfo: any,
    successCallback: any,
    failureCallback: any,
  ) {
    try {
      const { startStr, endStr } = fetchInfo

      const response = await api.get('/user-events', {
        params: {
          from: startStr,
          to: endStr,
        },
      })

      const data = response.data

      const sessionsEvents = data.userSessions.map((session: any) => ({
        title: session.title,
        start: session.startedAt,
        allDay: true,
        colorBorder: session.tag.color,
      }))

      const quizzesAttemptsEvents = data.userQuizzesAttempts.map(
        (attempt: any) => ({
          title: attempt.quizTitle,
          start: attempt.finishedAt,
          allDay: true,
          colorBorder: attempt.tag.color,
        }),
      )

      successCallback([...sessionsEvents, ...quizzesAttemptsEvents])
    } catch (err) {
      failureCallback(err)
    }
  }

  useEffect(() => {
    const api = calendarRef.current?.getApi()
    if (!api) return
    const timeout = setTimeout(() => api.updateSize(), 250)
    return () => clearTimeout(timeout)
  }, [open])

  function renderEventContent(eventInfo: any) {
    return (
      <div
        className="w-full m-0 p-1 border-2 rounded-sm h-4 md:h-auto"
        style={{
          backgroundColor: hexToRgba(
            eventInfo.event.extendedProps.colorBorder,
            0.08,
          ),
          borderColor: eventInfo.event.extendedProps.colorBorder,
          whiteSpace: 'normal',
        }}
      >
        <div
          className="text-black text-sm font-medium break-all hidden md:block"
          style={{ fontSize: '12px' }}
        >
          {eventInfo.event.title}
        </div>
      </div>
    )
  }

  function handleDateClick(info: any) {
    const calendarApi = calendarRef.current?.getApi()
    const allEvents = calendarApi ? calendarApi.getEvents() : []

    const clickedDate = info.dateStr

    const dayEvents = allEvents.filter(
      (e) => e.startStr.split('T')[0] === clickedDate,
    )

    setSelectedEvents(dayEvents)
    setSelectedDate(new Date(clickedDate).toLocaleDateString('pl-PL'))
    setDialogOpen(true)
  }

  return (
    <>
      <div className="overflow-y-hidden">
        <div className="flex flex-col mb-4 gap-2 justify-center items-center md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => calendarRef.current?.getApi().prev()}
              className="px-3"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>

            <div className="text-center font-semibold text-lg select-none sm:text-base">
              {currentMonthTitle}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => calendarRef.current?.getApi().next()}
              className="px-3"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => calendarRef.current?.getApi().today()}
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
            headerToolbar={false}
            eventBackgroundColor="transparent"
            displayEventTime={false}
            eventDisplay="block"
            dateClick={handleDateClick}
            eventContent={renderEventContent}
            defaultAllDay={true}
            dayMaxEventRows={false}
            eventSources={[
              {
                events: fetchEvents,
                failure: (error) => toast.error('Failed to fetch events'),
              },
            ]}
            datesSet={(arg) => setCurrentMonthTitle(arg.view.title)}
          />
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Events on {selectedDate}</DialogTitle>
          </DialogHeader>

          {selectedEvents.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {selectedEvents.map((event: any, idx: number) => (
                <li
                  key={idx}
                  className="p-2 border-2 rounded-md"
                  style={{
                    borderColor: event.extendedProps.colorBorder,
                    backgroundColor: hexToRgba(
                      event.extendedProps.colorBorder,
                      0.05,
                    ),
                  }}
                >
                  {event.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground mt-3 mx-auto">
              No events on this day.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
