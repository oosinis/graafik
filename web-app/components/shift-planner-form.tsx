'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Shift } from '@/models/Shift'
import { Worker } from '@/models/Worker'
import { Rule } from '@/models/Rule'
import { ScheduleRequest } from '@/models/ScheduleRequest'

const months = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 },
]

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export function ShiftPlannerForm() {
  const [workers, setWorkers] = useState<Worker[]>([{ name: '', assignedShifts: [] }])
  const [shifts, setShifts] = useState<Shift[]>([{ type: '', length: '' }])
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [fullTimeMonthlyHours, setFullTimeMonthlyHours] = useState<string>('')
  const [rules, setRules] = useState<Rule[]>([{ 
    shift: { type: 'no-shifts', length: '' }, 
    priority: 'medium', 
    daysApplied: [], 
    perDay: '', 
    restDays: ''
  }])
  const [isLoading, setIsLoading] = useState(false)

  const addWorker = () => {
    setWorkers([...workers, { name: '', assignedShifts: [] }])
  }

  const removeWorker = (index: number) => {
    const newWorkers = workers.filter((_, i) => i !== index)
    setWorkers(newWorkers.length ? newWorkers : [{ name: '', assignedShifts: [] }])
  }

  const updateWorker = (index: number, field: keyof Worker, value: any) => {
    const newWorkers = [...workers]
    newWorkers[index][field] = value
    setWorkers(newWorkers)
  }

  const toggleShiftForWorker = (workerIndex: number, shift: Shift) => {
    const newWorkers = [...workers]
    const currentShifts = newWorkers[workerIndex].assignedShifts
    const shiftIndex = currentShifts.findIndex(s => s.type === shift.type)
    if (shiftIndex !== -1) {
      newWorkers[workerIndex].assignedShifts = currentShifts.filter(s => s.type !== shift.type)
    } else {
      newWorkers[workerIndex].assignedShifts = [...currentShifts, shift]
    }
    setWorkers(newWorkers)
  }

  const addShift = () => {
    setShifts([...shifts, { type: '', length: '' }])
  }

  const removeShift = (index: number) => {
    const newShifts = shifts.filter((_, i) => i !== index)
    setShifts(newShifts.length ? newShifts : [{ type: '', length: '' }])
  }

  const updateShift = (index: number, field: keyof Shift, value: string) => {
    const newShifts = [...shifts]
    newShifts[index][field] = value
    setShifts(newShifts)
  }

  const addRule = () => {
    setRules([...rules, { 
      shift: { type: 'no-shifts', length: '' }, 
      priority: 'medium', 
      daysApplied: [], 
      perDay: '', 
      restDays: ''
    }])
  }

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index)
    setRules(newRules.length ? newRules : [{
      shift: { type: 'no-shifts', length: '' }, 
      priority: 'medium', 
      daysApplied: [], 
      perDay: '', 
      restDays: ''
    }])
  }

  const updateRule = (index: number, field: keyof Rule, value: any) => {
    const newRules = [...rules]
    newRules[index][field] = value
    setRules(newRules)
  }

  const toggleDayForRule = (index: number, day: string) => {
    const newRules = [...rules]
    const currentDays = newRules[index].daysApplied
    if (currentDays.includes(day)) {
      newRules[index].daysApplied = currentDays.filter(d => d !== day)
    } else {
      newRules[index].daysApplied = [...currentDays, day]
    }
    setRules(newRules)
  }

  const createScheduleRequest = (): ScheduleRequest => {
    return {
      workers,
      shifts,
      rules,
      selectedMonth: selectedMonth || 0,
      fullTimeMonthlyHours: parseInt(fullTimeMonthlyHours, 10) || 0
    }
  }

  const sendScheduleRequest = async (scheduleRequest: ScheduleRequest) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleRequest),
      })

      if (!response.ok) {
        throw new Error('Failed to generate schedule')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error generating schedule:', error)
     
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Worker Shift Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={async (e) => {
          e.preventDefault()
          const scheduleRequest = createScheduleRequest()
          await sendScheduleRequest(scheduleRequest)
        }}>
          <div className="space-y-2 flex flex-wrap items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="month">Select Month</Label>
              <Select 
                value={selectedMonth ? selectedMonth.toString() : undefined} 
                onValueChange={(value) => setSelectedMonth(parseInt(value, 10))}
              >
                <SelectTrigger id="month">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="fullTimeHours">Full time monthly hours</Label>
              <Input
                id="fullTimeHours"
                type="number"
                value={fullTimeMonthlyHours}
                onChange={(e) => setFullTimeMonthlyHours(e.target.value)}
                placeholder="Enter hours"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Shifts</Label>
            <div className="space-y-2">
              {shifts.map((shift, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={shift.type}
                    onChange={(e) => updateShift(index, 'type', e.target.value)}
                    placeholder="Shift type"
                  />
                  <Input
                    type="number"
                    value={shift.length}
                    onChange={(e) => updateShift(index, 'length', e.target.value)}
                    placeholder="Length (hours)"
                    min="1"
                    max="24"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeShift(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove shift</span>
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addShift}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Shift
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workers">Worker List</Label>
            <div className="space-y-4">
              {workers.map((worker, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        id={`worker-${index}`}
                        value={worker.name}
                        onChange={(e) => updateWorker(index, 'name', e.target.value)}
                        placeholder={`Worker ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeWorker(index)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove worker</span>
                      </Button>
                    </div>
                    <div>
                      <Label className="mb-2 block">Assigned Shifts</Label>
                      <div className="flex flex-wrap gap-2">
                        {shifts.filter(shift => shift.type.trim() !== '').map((shift) => (
                          <div key={shift.type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${index}-${shift.type}`}
                              checked={worker.assignedShifts.some(s => s.type === shift.type)}
                              onCheckedChange={() => toggleShiftForWorker(index, shift)}
                            />
                            <Label htmlFor={`${index}-${shift.type}`}>{shift.type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addWorker}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Worker
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Scheduling Rules</Label>
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Select
                        value={rule.shift.type}
                        onValueChange={(value) => {
                          const selectedShift = shifts.find(s => s.type === value)
                          updateRule(index, 'shift', selectedShift || { type: '', length: '' })
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select shift type" />
                        </SelectTrigger>
                        <SelectContent>
                          {shifts.some(shift => shift.type.trim() !== '') ? (
                            shifts
                              .filter(shift => shift.type.trim() !== '')
                              .map((shift) => (
                                <SelectItem key={shift.type} value={shift.type}>
                                  {shift.type}
                                </SelectItem>
                              ))
                          ) : (
                            <SelectItem value="no-shifts">No shifts created yet</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Select
                        value={rule.priority}
                        onValueChange={(value) => updateRule(index, 'priority', value)}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-2 block">Days Applied</Label>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${index}-${day}`}
                              checked={rule.daysApplied.includes(day)}
                              onCheckedChange={() => toggleDayForRule(index, day)}
                            />
                            <Label htmlFor={`${index}-${day}`}>{day}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={rule.perDay}
                        onChange={(e) => updateRule(index, 'perDay', e.target.value)}
                        placeholder="Shifts per day"
                        min="1"
                        className="w-[150px]"
                      />
                      <Input
                        type="number"
                        value={rule.restDays}
                        onChange={(e) => updateRule(index, 'restDays', e.target.value)}
                        placeholder="Rest days after"
                        min="0"
                        className="w-[150px]"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRule(index)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove rule</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addRule}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Rule
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Schedule'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

