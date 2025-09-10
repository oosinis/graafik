"use client"

import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

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

type Props = {
  fullTimeHours: string;
  onFullTimeHoursChange: (value: string) => void;
  month: string;
  onMonthChange: (value: string) => void;
};

export function MonthsHoursStep({ fullTimeHours, onFullTimeHoursChange, month, onMonthChange }: Props) {
      
    return(
            <div className="mb-6">
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
                <div className="flex mb-6">
                <div>
                  <label className="flex text-sm font-medium mb-2">Select month</label>
                  <div className="pr-6">
                    <div>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={month}
                        onChange={(e) => onMonthChange(e.target.value)}
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
                  <label className="flex text-sm font-medium mb-2">Full-time monthly hours</label>
                  <Input
                    type="number"
                    value={fullTimeHours}
                    onChange={(e) => onFullTimeHoursChange(e.currentTarget.value)}
                    className="max-w-xs"
                  />
                </div>  
                </div>
                
              </Card>
  
            </div>
    )
}