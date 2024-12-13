
import  { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isWeekend, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Event } from '@/types/index'
import EventModal from '@/components/forms/event-modal'
import EventList from '../event-list'
import Day from '../day'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEventListOpen, setIsEventListOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [filterKeyword, setFilterKeyword] = useState('')
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json')

  useEffect(() => {
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events))
    }
  }, [events])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setIsEventListOpen(true)
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleDeleteEvent = (eventToDelete: Event) => {
    setEvents(events.filter(event => event.id !== eventToDelete.id))
  }

  const handleSaveEvent = (newEvent: Event) => {
    
    /**
     * This is handle save function 
     * - First checking the overlapping by checking follwings
     *   - previousEventId !== newEventId
     *   - eventDate !== newEventDate (cuzz id is not the same then have to check the event date)
     *   - 
     *   
     */

    const isOverlapping = events.some(event => {
      if (event.id === newEvent.id) return false // Skip the event being edited
      if (event.date !== newEvent.date) return false
      const eventStart = parseISO(`${event.date}T${event.startTime}`)
      const eventEnd = parseISO(`${event.date}T${event.endTime}`)
      const newEventStart = parseISO(`${newEvent.date}T${newEvent.startTime}`)
      const newEventEnd = parseISO(`${newEvent.date}T${newEvent.endTime}`)
      return (
        (newEventStart >= eventStart && newEventStart < eventEnd) ||
        (newEventEnd > eventStart && newEventEnd <= eventEnd) ||
        (newEventStart <= eventStart && newEventEnd >= eventEnd)
      )
    })

    if (isOverlapping) {
      alert('This event overlaps with an existing event. Please choose a different time.')
      return
    }

    if (editingEvent) {
      setEvents(events.map(event => event.id === editingEvent.id ? newEvent : event))
    } else {
      setEvents([...events, { ...newEvent, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  const handleMoveEvent = (eventId: number, newDate: string) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, date: newDate } : event
    ))
  }

  const filteredEvents = filterKeyword
  ? events.filter(event =>
      event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
      event.description?.toLowerCase().includes(filterKeyword.toLowerCase())
    )
  : events

  const handleExport = () => {
    /**
     * Get all the events happened in current month
     * by providing the eventDates and currentDate
     * and only return the events of this month
     */
    const currentMonthEvents = events.filter(event => {
      const eventDate = parseISO(event.date)
      return isSameMonth(eventDate, currentDate)
    })


    /**
     * Here creating the two variable 
     * After conditional executive we'll assign somethign into these
     */

    let content: string
    let filename: string

    /**
     * Checking for the type and if the type is json
     * we're stringify the 
     * [
     *    {
     *      "some_data"
     *    }
     * ]
     * 
     * and filename based on current date in
     */
    if (exportFormat === 'json') {
      content = JSON.stringify(currentMonthEvents, null, 2)
      filename = `events_${format(currentDate, 'yyyy-MM')}.json`
    } else {
      /**
       * Now comes to the csv files
       * 
       * We're first defining the headers that are going to be in csv file 
       * 
       * then we're creating csv content
       * 
       * when we do headers.join(",") 
       * if joins the header like this 
       * 
       * 'id,name,date,startTime,endTime.....' (Now this becomes the header )
       * 
       * and after that we're putting the data below the header by checking each header
       * 
       * then again we're joining each data by /n that 
       * puts event like => 
       * header
       * row 1 \n 
       * row 2 
       * ....
       */
      const headers = ['id', 'name', 'date', 'startTime', 'endTime', 'description', 'color']
      const csvContent = [
        headers.join(','),
        ...currentMonthEvents.map(event => 
          headers.map(header => 
            //@ts-ignore
            header === 'description' ? `"${event[header] || ''}"` : event[header]
          ).join(',')
        )
      ].join('\n')
      content = csvContent
      filename = `events_${format(currentDate, 'yyyy-MM')}.csv`
    }

    /**
     * We always use blob to create a binary file that we pass in URL.createObject to download it 
     * 
     * and manually giving it in link and forcefully clicking it, not by user interation
     * 
     * then it gets downlaoded
     */
    const blob = new Blob([content], { type: exportFormat === 'json' ? 'application/json' : 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{format(currentDate, 'MMMM yyyy')}</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Filter events..."
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="w-64"
            />
            <div className="flex items-center space-x-2">
              <Select value={exportFormat} onValueChange={(value: 'json' | 'csv') => setExportFormat(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-sm text-gray-500 py-2">
                {day}
              </div>
            ))}
            {monthDays.map(day => {
              const dayEvents = filteredEvents.filter(event => isSameDay(parseISO(event.date), day))
              return dayEvents.length > 0 || !filterKeyword ? (
                <Day
                  key={day.toString()}
                  date={day}
                  isCurrentMonth={isSameMonth(day, currentDate)}
                  isToday={isToday(day)}
                  isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
                  isWeekend={isWeekend(day)}
                  events={dayEvents}
                  onClick={() => handleDayClick(day)}
                  onMoveEvent={handleMoveEvent}
                />
              ) : null
            })}
          </div>
        </CardContent>
        {selectedDate && (
          <EventList
            isOpen={isEventListOpen}
            onClose={() => setIsEventListOpen(false)}
            date={selectedDate}
            events={filteredEvents.filter(event => isSameDay(parseISO(event.date), selectedDate))}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          event={editingEvent}
          date={selectedDate}
        />
      </Card>
    </DndProvider>
  )
}

