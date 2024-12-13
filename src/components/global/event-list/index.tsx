import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Event } from '@/types/index'
import { cn } from "@/lib/utils"
import { colorClasses } from '../event-item/index'

interface EventListProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  events: Event[]
  onAddEvent: () => void
  onEditEvent: (event: Event) => void
  onDeleteEvent: (event: Event) => void
}

export default function EventList({ isOpen, onClose, date, events, onAddEvent, onEditEvent, onDeleteEvent }: EventListProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Events for {format(date, 'MMMM d, yyyy')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground">No events for this day.</p>
          ) : (
            <ul className="space-y-4">
              {events.map(event => (
                <li key={event.id} className={cn("p-2 border rounded", colorClasses[event.color])}>
                  <div className="font-semibold">{event.name}</div>
                  <div className="text-sm opacity-75">{event.startTime} - {event.endTime}</div>
                  {event.description && <div className="text-sm mt-1">{event.description}</div>}
                  <div className="mt-2 space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEditEvent(event)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => onDeleteEvent(event)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onAddEvent}>Add Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

