"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Pencil, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function MultiStepPlanner() {
  const [activeShift, setActiveShift] = useState<string>("Hommikune")
  const [activeRule, setActiveRule] = useState<string>("Tööpäevadel")
  const router = useRouter()

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const shifts = [
    { id: "1", name: "Päevane", active: false },
    { id: "2", name: "Hommikune", active: true },
    { id: "3", name: "Õhtune", active: false },
  ]

  const rules = [
    { id: "1", name: "Tööpäevadel", active: true },
    { id: "2", name: "Reedeti", active: false },
    { id: "3", name: "Puhkepäevadel", active: false },
  ]

  const workers = [
    {
      id: "1",
      name: "John Doe",
      shifts: [
        { type: "Hommikune vahetus", active: true },
        { type: "Päevane vahetus", active: true },
        { type: "Õhtune vahetus", active: false },
      ],
    },
    {
      id: "2",
      name: "Jane Smith",
      shifts: [
        { type: "Hommikune vahetus", active: false },
        { type: "Päevane vahetus", active: true },
        { type: "Õhtune vahetus", active: false },
      ],
    },
  ]



  const generateSchedule = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const requestBody = {
      workers,
      shifts,
      month: months.indexOf(month) + 1,
      fullTimeHours: Number(fullTimeHours),
    };

    const response = await fetch(`${apiUrl}/create-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      alert("Failed to generate schedule");
      return;
    }

  };

  return (
    <div className="flex">

      {/* Main content */}
      <div className="flex-1">
        {/* Shifts & Rules Step */}
        {currentStep === "shifts-rules" && (
          <div>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <h2 className="text-xl text-gray-500 font-medium mb-2">Shifts & Rules</h2>
              <p className="text-gray-500">Choose the year and month, add the full-time working hours of the month</p>
            </div>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Shift Details</h2>
                  <button className="text-purple-600 mt-1">Retrieve data from last month</button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700">
                    Continue
                  </Button>
                </div>
              </div>

              <p className="text-gray-500 mb-6">
                Create shifts and rules for specific months, assign shifts to employees.
              </p>

              <div className="flex space-x-2 mb-6">
                {shifts.map((shift) => (
                  <Button
                    key={shift.id}
                    variant={shift.active ? "default" : "outline"}
                    className={shift.active ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => setActiveShift(shift.name)}
                  >
                    {shift.name} <Pencil className="ml-2 h-4 w-4" />
                  </Button>
                ))}
                <Button variant="outline">
                  Add Shift <Plus className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Shift Title</label>
                  <Input value={activeShift} onChange={(e) => setActiveShift(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Shift Length</label>
                  <div className="flex items-center space-x-2">
                    <Input type="number" value="08" className="w-16" />
                    <span>h</span>
                    <Input type="number" value="30" className="w-16" />
                    <span>min</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Rules</h3>
                <div className="flex space-x-2 mb-4">
                  {rules.map((rule) => (
                    <Button
                      key={rule.id}
                      variant={rule.active ? "default" : "outline"}
                      className={rule.active ? "bg-purple-600 hover:bg-purple-700" : ""}
                      onClick={() => setActiveRule(rule.name)}
                    >
                      {rule.name} <Pencil className="ml-2 h-4 w-4" />
                    </Button>
                  ))}
                  <Button variant="outline">
                    Add Rule <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <Card className="p-6 bg-gray-50">
                  <div className="flex justify-between mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rule Title</label>
                      <Input value={activeRule} onChange={(e) => setActiveRule(e.target.value)} className="max-w-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Low
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                          Medium
                        </Button>
                        <Button variant="outline" size="sm">
                          High
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Days Applied</label>
                    <div className="flex space-x-2">
                      <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        Mo
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        Tu
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        We
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        Th
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        Fr
                      </Button>
                      <Button variant="outline" size="sm">
                        Sa
                      </Button>
                      <Button variant="outline" size="sm">
                        Su
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Shifts Per Day</label>
                      <Input type="number" value="3" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Off-Days After</label>
                      <Input type="number" value="2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Continuous Days</label>
                      <Input type="number" value="3" />
                    </div>
                  </div>
                </Card>
              </div>
            </Card>

            <div className="mt-6 bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl text-gray-500 font-medium mb-2">Assign Employees</h2>
              <p className="text-gray-500">Assign employees to shifts</p>
            </div>
          </div>
        )}

        {/* Assign Employees Step */}
        {currentStep === "assign-employees" && (
          <div>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <h2 className="text-xl text-gray-500 font-medium mb-2">Shifts & Rules</h2>
              <p className="text-gray-500">Create shifts and rules for specific months, assign shifts to employees.</p>
            </div>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Assign Employees</h2>
                  <button className="text-purple-600 mt-1">Retrieve data from last month</button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700">
                    Generate Schedule
                  </Button>
                </div>
              </div>

              <p className="text-gray-500 mb-6">Assign employees to shifts</p>

              {workers.map((worker) => (
                <Card key={worker.id} className="p-6 mb-4 bg-gray-50">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-medium">{worker.name}</h3>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {worker.shifts.map((shift, index) => (
                      <Button
                        key={index}
                        variant={shift.active ? "default" : "outline"}
                        className={shift.active ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        {shift.type}
                      </Button>
                    ))}
                  </div>
                </Card>
              ))}

              <Button variant="outline" className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Worker
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
