import { useState, useEffect } from "react"
import { DateRange } from "react-date-range"
import { format } from "date-fns"

type Props = {
  range: {
    startDate: Date
    endDate: Date
  }
  onChange: (range: { startDate: Date; endDate: Date }) => void
}

export function DateRangePicker({ range, onChange }: Props) {
  const [localRange, setLocalRange] = useState([
    {
      startDate: range.startDate,
      endDate: range.endDate,
      key: "selection",
    },
  ])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    onChange({
      startDate: localRange[0].startDate,
      endDate: localRange[0].endDate,
    })
  }, [localRange])

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border px-4 py-2 rounded bg-white shadow-sm hover:bg-gray-100"
      >
        {`${format(localRange[0].startDate, "MMM dd")} → ${format(
          localRange[0].endDate,
          "MMM dd"
        )}`}
      </button>

      {isOpen && (
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setLocalRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={localRange}
          months={2}
          direction="horizontal"
          minDate={new Date()}
        />
      )}
    </div>
  )
}
