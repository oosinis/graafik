"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Shift } from "@/models/Shift"
import type { Worker } from "@/models/Worker"
import type { Rule } from "@/models/Rule"
import type { ScheduleRequest } from "@/models/ScheduleRequest"
import { useRouter } from "next/navigation"

const months = [
  { name: "Jaanuar", value: 1 },
  { name: "Veebruar", value: 2 },
  { name: "Märts", value: 3 },
  { name: "Aprill", value: 4 },
  { name: "Mai", value: 5 },
  { name: "Juuni", value: 6 },
  { name: "Juuli", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "Oktoober", value: 10 },
  { name: "November", value: 11 },
  { name: "Detsember", value: 12 },
]

const daysOfWeek = [
  { name: "E", value: 1 },
  { name: "T", value: 2 },
  { name: "K", value: 3 },
  { name: "N", value: 4 },
  { name: "R", value: 5 },
  { name: "L", value: 6 },
  { name: "P", value: 7 },
]

const priorities = [
  { value: "low", label: "Madal" },
  { value: "medium", label: "Keskmine" },
  { value: "high", label: "Kõrge" },
]

const isClient = typeof window !== "undefined"

export function ShiftPlannerForm() {
  const [workers, setWorkers] = useState<Worker[]>([{ name: "", assignedShifts: [] }])
  const [shifts, setShifts] = useState<Shift[]>([{ type: "", length: 0, rules: [] }])
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [fullTimeMonthlyHours, setFullTimeMonthlyHours] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isClientState, setIsClient] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (isClient) {
      setIsClient(true)
    }
  }, [])

  const addWorker = () => {
    setWorkers([...workers, { name: "", assignedShifts: [] }])
  }

  const removeWorker = (index: number) => {
    const newWorkers = workers.filter((_, i) => i !== index)
    setWorkers(newWorkers.length ? newWorkers : [{ name: "", assignedShifts: [] }])
  }

  const updateWorker = (index: number, field: keyof Worker, value: any) => {
    const newWorkers = [...workers]
    newWorkers[index][field] = value
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

  const addShift = () => {
    setShifts([...shifts, { type: "", length: 0, rules: [] }])
  }

  const removeShift = (index: number) => {
    const newShifts = shifts.filter((_, i) => i !== index)
    setShifts(newShifts.length ? newShifts : [{ type: "", length: 0, rules: [] }])
  }

  const updateShift = (index: number, field: keyof Shift, value: string | number) => {
    const newShifts = [...shifts]
    if (field === "length") {
      newShifts[index][field] = Number(value)
    } else {
      newShifts[index][field] = value
    }
    setShifts(newShifts)
  }

  const addRule = (shiftIndex: number) => {
    const newShifts = [...shifts]
    newShifts[shiftIndex].rules.push({
      priority: "medium",
      daysApplied: [],
      perDay: 0,
      restDays: 0,
      continuousDays: 0,
    })
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
    } else {
      newShifts[shiftIndex].rules[ruleIndex][field] = value
    }
    setShifts(newShifts)
  }

  const toggleDayForRule = (shiftIndex: number, ruleIndex: number, day: number) => {
    const newShifts = [...shifts]
    const currentDays = newShifts[shiftIndex].rules[ruleIndex].daysApplied
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
      selectedMonth: selectedMonth || 0,
      fullTimeMonthlyHours: Number.parseInt(fullTimeMonthlyHours, 10) || 0,
    }
  }

  const sendScheduleRequest = async (scheduleRequest: ScheduleRequest) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-schedule", {
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
        title: "Graafik edukalt genereeritud",
        description: "Teie graafik on loodud ja salvestatud.",
      })
      router.push(`/schedule?year=${new Date().getFullYear()}&month=${scheduleRequest.selectedMonth}`)
    } catch (error) {
      console.error("Error generating schedule:", error)
      toast({
        title: "Viga graafiku genereerimisel",
        description: "Graafiku genereerimisel tekkis probleem. Palun proovige uuesti.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewSchedule = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1 // JavaScript months are 0-indexed
    router.push(`/schedule?year=${currentYear}&month=${currentMonth}`)
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  return isClient ? (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Vahetuste Planeerija</CardTitle>
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
              <Label htmlFor="month">Vali kuu</Label>
              <Select
                value={selectedMonth ? selectedMonth.toString() : undefined}
                onValueChange={(value) => setSelectedMonth(Number.parseInt(value, 10))}
              >
                <SelectTrigger id="month">
                  <SelectValue placeholder="Vali kuu" />
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
              <Label htmlFor="fullTimeHours">Täistööaja tunnid kuus</Label>
              <Input
                id="fullTimeHours"
                type="number"
                value={fullTimeMonthlyHours}
                onChange={(e) => setFullTimeMonthlyHours(e.target.value)}
                placeholder="Sisesta tunnid"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vahetused</Label>
            <div className="space-y-4">
              {shifts.map((shift, shiftIndex) => (
                <Card key={shiftIndex} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Label htmlFor={`shift-type-${shiftIndex}`}>Vahetuse tüüp</Label>
                        <Input
                          id={`shift-type-${shiftIndex}`}
                          value={shift.type}
                          onChange={(e) => updateShift(shiftIndex, "type", e.target.value)}
                          placeholder="Sisesta vahetuse tüüp"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`shift-length-${shiftIndex}`}>Vahetuse pikkus (tundides)</Label>
                        <Input
                          id={`shift-length-${shiftIndex}`}
                          type="number"
                          value={shift.length}
                          onChange={(e) => updateShift(shiftIndex, "length", e.target.value)}
                          placeholder="Sisesta vahetuse pikkus"
                          min="1"
                          max="24"
                        />
                      </div>
                      <Button type="button" variant="outline" size="icon" onClick={() => removeShift(shiftIndex)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Eemalda vahetus</span>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Reeglid</Label>
                        <Button type="button" variant="outline" size="sm" onClick={() => addRule(shiftIndex)}>
                          <Plus className="mr-2 h-4 w-4" /> Lisa reegel
                        </Button>
                      </div>
                      {shift.rules.map((rule, ruleIndex) => (
                        <Card key={ruleIndex} className="p-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor={`rule-priority-${shiftIndex}-${ruleIndex}`}>Prioriteet</Label>
                              <Select
                                value={rule.priority}
                                onValueChange={(value) => updateRule(shiftIndex, ruleIndex, "priority", value)}
                              >
                                <SelectTrigger id={`rule-priority-${shiftIndex}-${ruleIndex}`}>
                                  <SelectValue placeholder="Vali prioriteet" />
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
                              <Label className="mb-2 block">Rakendatavad päevad</Label>
                              <div className="flex flex-wrap gap-2">
                                {daysOfWeek.map((day) => (
                                  <div key={day.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${shiftIndex}-${ruleIndex}-${day.name}`}
                                      checked={rule.daysApplied.includes(day.value)}
                                      onCheckedChange={() => toggleDayForRule(shiftIndex, ruleIndex, day.value)}
                                    />
                                    <Label htmlFor={`${shiftIndex}-${ruleIndex}-${day.name}`}>{day.name}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1">
                                <Label htmlFor={`rule-perday-${shiftIndex}-${ruleIndex}`}>Vahetusi päevas</Label>
                                <Input
                                  id={`rule-perday-${shiftIndex}-${ruleIndex}`}
                                  type="number"
                                  value={rule.perDay}
                                  onChange={(e) => updateRule(shiftIndex, ruleIndex, "perDay", e.target.value)}
                                  placeholder="Sisesta vahetuste arv"
                                  min="1"
                                />
                              </div>
                              <div className="flex-1">
                                <Label htmlFor={`rule-restdays-${shiftIndex}-${ruleIndex}`}>Puhkepäevad pärast</Label>
                                <Input
                                  id={`rule-restdays-${shiftIndex}-${ruleIndex}`}
                                  type="number"
                                  value={rule.restDays}
                                  onChange={(e) => updateRule(shiftIndex, ruleIndex, "restDays", e.target.value)}
                                  placeholder="Sisesta puhkepäevade arv"
                                  min="0"
                                />
                              </div>
                              <div className="flex-1">
                                <Label htmlFor={`rule-continuousdays-${shiftIndex}-${ruleIndex}`}>
                                  Järjestikused päevad
                                </Label>
                                <Input
                                  id={`rule-continuousdays-${shiftIndex}-${ruleIndex}`}
                                  type="number"
                                  value={rule.continuousDays}
                                  onChange={(e) => updateRule(shiftIndex, ruleIndex, "continuousDays", e.target.value)}
                                  placeholder="Sisesta päevade arv"
                                  min="0"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeRule(shiftIndex, ruleIndex)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Eemalda reegel</span>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addShift}>
              <Plus className="mr-2 h-4 w-4" /> Lisa vahetus
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workers">Töötajate nimekiri</Label>
            <div className="space-y-4">
              {workers.map((worker, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        id={`worker-${index}`}
                        value={worker.name}
                        onChange={(e) => updateWorker(index, "name", e.target.value)}
                        placeholder={`Töötaja ${index + 1}`}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => removeWorker(index)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Eemalda töötaja</span>
                      </Button>
                    </div>
                    <div>
                      <Label className="mb-2 block">Määratud vahetused</Label>
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
                  </div>
                </Card>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addWorker}>
              <Plus className="mr-2 h-4 w-4" /> Lisa töötaja
            </Button>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Genereerimine..." : "Genereeri graafik"}
            </Button>
            <Button type="button" variant="outline" onClick={handleViewSchedule}>
              Vaata graafikut
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  ) : null
}
