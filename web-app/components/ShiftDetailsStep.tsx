"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Plus} from "lucide-react"
import { Input } from "@/components/ui/input"


export function ShiftDetailsStep(){
    const [activeShift, setActiveShift] = useState<string>("Hommikune")

    const shifts = [
        { id: "1", name: "Päevane", active: false },
        { id: "2", name: "Hommikune", active: true },
        { id: "3", name: "Õhtune", active: false },
      ]
      
    return(
        <div>
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Shift Details</h2>
                  <button className="text-purple-600 mt-1">Retrieve data from last month</button>
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
            </Card>
        </div>
    )
}