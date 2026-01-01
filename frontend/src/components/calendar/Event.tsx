import { BookOpenIcon, MessageCircleQuestionMark } from 'lucide-react'
import type { QuizEvent, SessionEvent } from './Calendar'

export default function Event({event}: {event: SessionEvent | QuizEvent}) {
  return (
    <div className="w-full m-0 p-1 border cursor-pointer rounded-md overflow-hidden relative hover:bg-muted">
      <div
        className="w-1 h-full absolute top-0 left-0"
        style={{ backgroundColor: event.borderColor }}
      />
      <div className="flex flex-row items-center gap-2 ml-2 text-muted-foreground  ">
        <div className="w-fit self-start">
          {event.extendedProps.type === 'session' ? (
            <BookOpenIcon size={14} />
          ) : (
            <MessageCircleQuestionMark size={14} />
          )}
        </div>
        <div className="text-xs font-medium hidden  md:line-clamp-3 ">
          {event.title}
        </div>
      </div>
    </div>
  )
}
