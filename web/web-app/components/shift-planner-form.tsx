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

interface Shift {
  type: string
  length: string
}

interface Worker {
  name: string
  assignedShifts: string[]
}

interface Rule {
  shiftType: string;
  priority: 'low' | 'medium' | 'high';
  daysApplied: string[];
  perDay: string;
  restDays: string;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
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
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [rules, setRules] = useState<Rule[]>([{ 
    shiftType: 'no-shifts', 
    priority: 'medium', 
    daysApplied: [], 
    perDay: '', 
    restDays: ''
  }])

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

  const toggleShiftForWorker = (workerIndex: number, shiftType: string) => {
    const newWorkers = [...workers]
    const currentShifts = newWorkers[workerIndex].assignedShifts
    if (currentShifts.includes(shiftType)) {
      newWorkers[workerIndex].assignedShifts = currentShifts.filter(s => s !== shiftType)
    } else {
      newWorkers[workerIndex].assignedShifts = [...currentShifts, shiftType]
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
      shiftType: 'no-shifts', 
      priority: 'medium', 
      daysApplied: [], 
      perDay: '', 
      restDays: ''
    }])
  }

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index)
    setRules(newRules.length ? newRules : [{
      shiftType: 'no-shifts', 
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

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Worker Shift Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="month">Select Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger id="month">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                              checked={worker.assignedShifts.includes(shift.type)}
                              onCheckedChange={() => toggleShiftForWorker(index, shift.type)}
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
                        value={rule.shiftType}
                        onValueChange={(value) => updateRule(index, 'shiftType', value)}
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
                            <SelectItem value="no-shifts" disabled>
                              No shifts created yet
                            </SelectItem>
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

          <Button type="submit" className="w-full">
            Generate Schedule
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

