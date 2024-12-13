import { format } from 'date-fns'
import { useDrop } from 'react-dnd'
import { cn } from "@/lib/utils"
import { Event } from '@/types/index'
import EventItem from '../event-item'


interface DayProps {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isWeekend: boolean
  events: Event[]
  onClick: () => void
  onMoveEvent: (eventId: number, newDate: string) => void
}

export default function Day({ date, isCurrentMonth, isToday, isSelected, isWeekend, events, onClick, onMoveEvent }: DayProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'event',
    drop: (item: { id: number }) => {
      onMoveEvent(item.id, format(date, 'yyyy-MM-dd'))
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      onClick={onClick}
      className={cn(
        "p-2 border rounded-lg cursor-pointer transition-colors min-h-[100px]",
        isCurrentMonth ? "bg-background" : "bg-muted text-muted-foreground",
        isToday && "border-primary",
        isSelected && "bg-primary/10",
        isWeekend && "bg-secondary/50",
        isOver && "bg-accent/50",
        "hover:bg-accent/25"
      )}
    >
      <div className={cn(
        "font-semibold text-sm mb-1",
        isSelected && "text-primary"
      )}>
        {format(date, 'd')}
      </div>
      <div className="space-y-1">
        {events.map(event => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

