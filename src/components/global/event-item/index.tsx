import { useDrag } from 'react-dnd'
import { cn } from "@/lib/utils"
import { Event } from '@/types/index'

interface EventItemProps {
  event: Event
}

export const colorClasses = {
  blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  green: 'bg-green-100 text-green-800 hover:bg-green-200',
  red: 'bg-red-100 text-red-800 hover:bg-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
}

export default function EventItem({ event }: EventItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'event',
    item: { id: event.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={cn(
        "text-xs p-1 rounded truncate transition-colors",
        colorClasses[event.color],
        isDragging && "opacity-50"
      )}
    >
      {event.name}
    </div>
  )
}

