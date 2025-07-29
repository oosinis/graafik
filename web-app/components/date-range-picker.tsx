import { useState } from "react"
import { DateRange } from "react-date-range"
import { addDays } from "date-fns"

export function DateRangePicker() {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ])

  return (
    <div>
      <DateRange
        editableDateInputs={true}
        onChange={(item) => setRange([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={range}
      />
    </div>
  )
}
