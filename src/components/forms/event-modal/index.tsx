import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {  EventColor, EventModalProps } from '@/types/index'



export default function EventModal({ isOpen, onClose, onSave, event, date }: EventModalProps) {
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState<EventColor>('blue')

  useEffect(() => {
    if (event) {
      setName(event.name)
      setStartTime(event.startTime)
      setEndTime(event.endTime)
      setDescription(event.description || '')
      setColor(event.color)
    } else {
      setName('')
      setStartTime('')
      setEndTime('')
      setDescription('')
      setColor('blue')
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (startTime >= endTime) {
      alert('End time must be after start time')
      return
    }
    onSave({
      id: event?.id || 0,
      name,
      date: date ? format(date, 'yyyy-MM-dd') : '',
      startTime,
      endTime,
      description,
      color
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-time" className="text-right">
                Start Time
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-time" className="text-right">
                End Time
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Color</Label>
              <RadioGroup
                value={color}
                onValueChange={(value: EventColor) => setColor(value)}
                className="col-span-3 flex space-x-2"
              >
                <RadioGroupItem value="blue" className="w-4 h-4 rounded-full bg-blue-500" />
                <RadioGroupItem value="green" className="w-4 h-4 rounded-full bg-green-500" />
                <RadioGroupItem value="red" className="w-4 h-4 rounded-full bg-red-500" />
                <RadioGroupItem value="yellow" className="w-4 h-4 rounded-full bg-yellow-500" />
                <RadioGroupItem value="purple" className="w-4 h-4 rounded-full bg-purple-500" />
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

