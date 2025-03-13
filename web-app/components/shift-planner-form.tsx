"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Shift } from "@/models/Shift"
import type { Worker } from "@/models/Worker"
import type { ScheduleRequest } from "@/models/ScheduleRequest"
import type { Rule } from "@/models/Rule"

// Define the Rule type explicitly to match your interface
type PriorityType = "low" | "medium" | "high" | "critical"

const months = [
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
]

const daysOfWeek = [
  { name: "Mon", value: 1 },
  { name: "Tue", value: 2 },
  { name: "Wed", value: 3 },
  { name: "Thu", value: 4 },
  { name: "Fri", value: 5 },
  { name: "Sat", value: 6 },
  { name: "Sun", value: 7 },
]

const priorities: { value: PriorityType; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

const isClient = typeof window !== "undefined"

// Default worker with all required properties
const defaultWorker: Worker = {
  name: "",
  assignedShifts: [],
  workLoad: 0,
  desiredVacationDays: [],
  vacationDays: [],
  requestedWorkDays: {},
}

export function ShiftPlannerForm() {
  const [workers, setWorkers] = useState<Worker[]>([{ ...defaultWorker }])
  const [shifts, setShifts] = useState<Shift[]>([{ type: "", duration: 0, rules: [] }])
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [fullTimeMonthlyHours, setFullTimeMonthlyHours] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isClientState, setIsClient] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isClient) {
      setIsClient(true)
    }
  }, [])

  const addWorker = () => {
    setWorkers([...workers, { ...defaultWorker }])
  }

  const removeWorker = (index: number) => {
    const newWorkers = workers.filter((_, i) => i !== index)
    setWorkers(newWorkers.length ? newWorkers : [{ ...defaultWorker }])
  }

  // Replace the updateWorker function with this more type-safe version:
  const updateWorker = (index: number, field: keyof Worker, value: any) => {
    const newWorkers = [...workers]

    // Type guard to ensure we're only updating valid properties
    if (field === "name") {
      newWorkers[index].name = value as string
    } else if (field === "workLoad") {
      newWorkers[index].workLoad = Number(value)
    } else if (field === "assignedShifts") {
      newWorkers[index].assignedShifts = value as Shift[]
    } else if (field === "desiredVacationDays" || field === "vacationDays") {
      newWorkers[index][field] = value as number[]
    } else if (field === "requestedWorkDays") {
      newWorkers[index].requestedWorkDays = value as Record<number, Shift>
    }

    setWorkers(newWorkers)
  }

  const toggleShiftForWorker = (workerIndex: number, shift: Shift) => {
    const newWorkers = [...workers]
    const currentShifts = newWorkers[workerIndex].assignedShifts
    const shiftIndex = currentShifts.findIndex((s) => s.type === shift.type)
    if (shiftIndex !== -1) {
      newWorkers[workerIndex].assignedShifts = currentShifts.filter((s) => s.type !== shift.type)
    } else {
      newWorkers[workerIndex].assignedShifts = [...currentShifts, shift]
    }
    setWorkers(newWorkers)
  }

  const toggleVacationDay = (workerIndex: number, day: number, isDesired = false) => {
    const newWorkers = [...workers]
    const field = isDesired ? "desiredVacationDays" : "vacationDays"
    const currentDays = [...newWorkers[workerIndex][field]]

    if (currentDays.includes(day)) {
      newWorkers[workerIndex][field] = currentDays.filter((d) => d !== day)
    } else {
      newWorkers[workerIndex][field] = [...currentDays, day]
    }

    setWorkers(newWorkers)
  }

  const setRequestedWorkDay = (workerIndex: number, day: number, shift: Shift | null) => {
    const newWorkers = [...workers]
    const requestedWorkDays = { ...newWorkers[workerIndex].requestedWorkDays }

    if (shift) {
      requestedWorkDays[day] = shift
    } else {
      delete requestedWorkDays[day]
    }

    newWorkers[workerIndex].requestedWorkDays = requestedWorkDays
    setWorkers(newWorkers)
  }

  const addShift = () => {
    setShifts([...shifts, { type: "", duration: 0, rules: [] }])
  }

  const removeShift = (index: number) => {
    const newShifts = shifts.filter((_, i) => i !== index)
    setShifts(newShifts.length ? newShifts : [{ type: "", duration: 0, rules: [] }])
  }

  const updateShift = (index: number, field: keyof Shift, value: string | number) => {
    const newShifts = [...shifts]

    if (field === "duration") {
      newShifts[index].duration = Number(value)
    } else {
      newShifts[index].type = value as string
    }

    setShifts(newShifts)
  }

  const addRule = () => {
    // If no shifts exist yet, don't add a rule
    if (shifts.length === 0 || shifts[0].type === "") return

    // Create a new rule for the first shift by default with a properly typed priority
    const newRule: Rule = {
      priority: "medium" as PriorityType,
      daysApplied: [] as number[],
      perDay: 0,
      restDays: 0,
      continuousDays: 0,
    }

    const newShifts = [...shifts]
    newShifts[0].rules = [...(newShifts[0].rules || []), newRule]
    setShifts(newShifts)
  }

  const removeRule = (shiftIndex: number, ruleIndex: number) => {
    const newShifts = [...shifts]
    newShifts[shiftIndex].rules = newShifts[shiftIndex].rules.filter((_, i) => i !== ruleIndex)
    setShifts(newShifts)
  }

  const updateRule = (shiftIndex: number, ruleIndex: number, field: keyof Rule, value: any) => {
    const newShifts = [...shifts]
    if (field === "perDay" || field === "restDays" || field === "continuousDays") {
      newShifts[shiftIndex].rules[ruleIndex][field] = Number(value)
    } else if (field === "priority") {
      // Ensure priority is one of the allowed values
      newShifts[shiftIndex].rules[ruleIndex][field] = value as PriorityType
    } else if (field === "daysApplied") {
      // Ensure daysApplied is handled correctly
      newShifts[shiftIndex].rules[ruleIndex][field] = value as number[]
    } else {

      newShifts[shiftIndex].rules[ruleIndex][field] = value
    }
    setShifts(newShifts)
  }

  const toggleDayForRule = (shiftIndex: number, ruleIndex: number, day: number) => {
    const newShifts = [...shifts]
    const currentDays = [...(newShifts[shiftIndex].rules[ruleIndex].daysApplied || [])]
    if (currentDays.includes(day)) {
      newShifts[shiftIndex].rules[ruleIndex].daysApplied = currentDays.filter((d) => d !== day)
    } else {
      newShifts[shiftIndex].rules[ruleIndex].daysApplied = [...currentDays, day]
    }
    setShifts(newShifts)
  }

  const createScheduleRequest = (): ScheduleRequest => {
    return {
      workers,
      shifts,
      month: selectedMonth || 0,
      fullTimeHours: Number.parseInt(fullTimeMonthlyHours, 10) || 0,
    }
  }

  const sendScheduleRequest = async (scheduleRequest: ScheduleRequest) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/create-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleRequest),
      })

      if (!response.ok) {
        throw new Error("Failed to generate schedule")
      }

      const data = await response.json()
      toast({
        title: "Schedule generated successfully",
        description: "Your schedule has been created and saved.",
      })
      return data
    } catch (error) {
      console.error("Error generating schedule:", error)
      toast({
        title: "Error generating schedule",
        description: "There was a problem generating your schedule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  return isClient ? (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Worker Shift Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault()
            const scheduleRequest = createScheduleRequest()
            await sendScheduleRequest(scheduleRequest)
          }}
        >
          <div className="space-y-2 flex flex-wrap items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="month">Select Month</Label>
              <Select
                value={selectedMonth ? selectedMonth.toString() : undefined}
                onValueChange={(value) => setSelectedMonth(Number.parseInt(value, 10))}
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
                    onChange={(e) => updateShift(index, "type", e.target.value)}
                    placeholder="Shift type"
                  />
                  <Input
                    type="number"
                    value={shift.duration}
                    onChange={(e) => updateShift(index, "duration", e.target.value)}
                    placeholder="Length (hours)"
                    min="1"
                    max="24"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeShift(index)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove shift</span>
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addShift}>
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
                        onChange={(e) => updateWorker(index, "name", e.target.value)}
                        placeholder={`Worker ${index + 1}`}
                      />
                      <Input
                        id={`workload-${index}`}
                        type="number"
                        value={worker.workLoad}
                        onChange={(e) => updateWorker(index, "workLoad", Number(e.target.value))}
                        placeholder="Workload %"
                        className="w-32"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => removeWorker(index)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove worker</span>
                      </Button>
                    </div>
                    <div>
                      <Label className="mb-2 block">Assigned Shifts</Label>
                      <div className="flex flex-wrap gap-2">
                        {shifts
                          .filter((shift) => shift.type.trim() !== "")
                          .map((shift) => (
                            <div key={shift.type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${index}-${shift.type}`}
                                checked={worker.assignedShifts.some((s) => s.type === shift.type)}
                                onCheckedChange={() => toggleShiftForWorker(index, shift)}
                              />
                              <Label htmlFor={`${index}-${shift.type}`}>{shift.type}</Label>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Desired Vacation Days</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedMonth &&
                          Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <div key={`desired-${day}`} className="flex items-center">
                              <Checkbox
                                id={`desired-${index}-${day}`}
                                checked={worker.desiredVacationDays.includes(day)}
                                onCheckedChange={() => toggleVacationDay(index, day, true)}
                              />
                              <Label htmlFor={`desired-${index}-${day}`} className="ml-1 mr-2">
                                {day}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Vacation Days</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedMonth &&
                          Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <div key={`vacation-${day}`} className="flex items-center">
                              <Checkbox
                                id={`vacation-${index}-${day}`}
                                checked={worker.vacationDays.includes(day)}
                                onCheckedChange={() => toggleVacationDay(index, day, false)}
                              />
                              <Label htmlFor={`vacation-${index}-${day}`} className="ml-1 mr-2">
                                {day}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Requested Work Days</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {selectedMonth &&
                          Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <div key={`requested-${day}`} className="border p-2 rounded">
                              <div className="text-center font-medium mb-1">{day}</div>
                              <Select
                                value={worker.requestedWorkDays[day]?.type || "none"}
                                onValueChange={(value) => {
                                  if (value === "none") {
                                    setRequestedWorkDay(index, day, null)
                                  } else {
                                    const shift = shifts.find((s) => s.type === value) || null
                                    setRequestedWorkDay(index, day, shift)
                                  }
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select shift" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  {shifts
                                    .filter((shift) => shift.type.trim() !== "")
                                    .map((shift) => (
                                      <SelectItem key={shift.type} value={shift.type}>
                                        {shift.type}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addWorker}>
              <Plus className="mr-2 h-4 w-4" /> Add Worker
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Scheduling Rules</Label>
            <div className="space-y-4">
              {shifts
                .filter((shift) => shift.type.trim() !== "")
                .map((shift, shiftIndex) => (
                  <Card key={shiftIndex} className="p-4">
                    <div className="space-y-4">
                      <div className="font-medium">{shift.type} Shift Rules</div>

                      {shift.rules && shift.rules.length > 0 ? (
                        shift.rules.map((rule, ruleIndex) => (
                          <div key={ruleIndex} className="border p-3 rounded-md space-y-3">
                            <div className="flex items-center space-x-2">
                              <Select
                                value={rule.priority}
                                onValueChange={(value: PriorityType) =>
                                  updateRule(shiftIndex, ruleIndex, "priority", value)
                                }
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
                                  <div key={day.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${shiftIndex}-${ruleIndex}-${day.name}`}
                                      checked={rule.daysApplied?.includes(day.value)}
                                      onCheckedChange={() => toggleDayForRule(shiftIndex, ruleIndex, day.value)}
                                    />
                                    <Label htmlFor={`${shiftIndex}-${ruleIndex}-${day.name}`}>{day.name}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={rule.perDay}
                                onChange={(e) => updateRule(shiftIndex, ruleIndex, "perDay", e.target.value)}
                                placeholder="Shifts per day"
                                min="1"
                                className="w-[120px]"
                              />
                              <Input
                                type="number"
                                value={rule.restDays}
                                onChange={(e) => updateRule(shiftIndex, ruleIndex, "restDays", e.target.value)}
                                placeholder="Rest days after"
                                min="0"
                                className="w-[120px]"
                              />
                              <Input
                                type="number"
                                value={rule.continuousDays}
                                onChange={(e) => updateRule(shiftIndex, ruleIndex, "continuousDays", e.target.value)}
                                placeholder="Continuous days"
                                min="0"
                                className="w-[120px]"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeRule(shiftIndex, ruleIndex)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove rule</span>
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No rules added for this shift.</div>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newShifts = [...shifts]
                          if (!newShifts[shiftIndex].rules) newShifts[shiftIndex].rules = []

                          // Create a properly typed rule
                          const newRule: Rule = {
                            priority: "medium" as PriorityType,
                            daysApplied: [] as number[],
                            perDay: 0,
                            restDays: 0,
                            continuousDays: 0,
                          }

                          newShifts[shiftIndex].rules.push(newRule)
                          setShifts(newShifts)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Rule to {shift.type}
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Schedule"}
          </Button>
        </form>
      </CardContent>
    </Card>
  ) : null
}

