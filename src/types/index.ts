export type EventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple'

export interface Event {
  id: number
  name: string
  date: string
  startTime: string
  endTime: string
  description?: string
  color: EventColor
}


export interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Event) => void
  event: Event | null
  date: Date | null
}