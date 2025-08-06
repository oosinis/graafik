"use client"

import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function AssignEmployeesStep(){
    
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
    
    
    
      /* const generateSchedule = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const requestBody = {
          workers,
          shifts,
          month: months.indexOf(month) + 1,
          fullTimeHours: Number(fullTimeHours),
        }; */
    
        /* const response = await fetch(`${apiUrl}/create-schedule`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
    
        if (!response.ok) {
          alert("Failed to generate schedule");
          return;
        } */
    return(
        <div>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Assign Employees</h2>
                  <button className="text-purple-600 mt-1">Retrieve data from last month</button>
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
              <Button /* onClick={generateSchedule} */ className="bg-purple-600 hover:bg-purple-700">
                    Generate Schedule
                  </Button>
            </Card>
          </div>
    )
}