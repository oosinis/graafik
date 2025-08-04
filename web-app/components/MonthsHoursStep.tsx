"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"


export function MonthsHoursStep(){
    const [fullTimeHours, setFullTimeHours] = useState<string>("170")
    const [year, setYear] = useState<string>("2025")
    const [month, setMonth] = useState<string>("March")
      
    const years = ["2023", "2024", "2025", "2026"]

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

    return(
            <div>
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Month & Hours</h2>
                    <button className="text-purple-600 mt-1">Retrieve data from last month</button>
                  </div>
  
                </div>
  
                <p className="text-gray-500 mb-4">
                  Choose the year and month, add the full-time working hours of the month
                </p>
  
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Select month</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-medium mb-2">Full-time monthly hours</label>
                  <Input
                    type="number"
                    value={fullTimeHours}
                    onChange={(e) => setFullTimeHours(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </Card>
  
            </div>
    )
}