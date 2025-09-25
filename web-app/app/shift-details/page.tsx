//import { ShiftDetailsCard } from "@/components/shift-details-card"
import { PageHeader } from "@/components/page-header"

export default function ShiftDetailsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Shift Details Example" />

      {/* <div className="flex flex-wrap gap-6">
        <ShiftDetailsCard
          day="Monday"
          date="3 March"
          shiftType="Evening"
          startTime="17:00"
          endTime="02:00"
          hours={9}
          worker="Mari Tamm"
          department="Intensiivosakond"
          fte="1.0"
          onEdit={() => console.log("Edit shift")}
        />

        <ShiftDetailsCard
          day="Tuesday"
          date="4 March"
          shiftType="Morning"
          startTime="06:00"
          endTime="14:00"
          hours={8}
          worker="Jaan Kask"
          department="Intensiivosakond"
          fte="0.75"
          onEdit={() => console.log("Edit shift")}
        />

        <ShiftDetailsCard
          day="Wednesday"
          date="5 March"
          shiftType="Night"
          startTime="22:00"
          endTime="06:00"
          hours={8}
          worker="Liis Lepp"
          department="Intensiivosakond"
          fte="1.0"
          onEdit={() => console.log("Edit shift")}
        />
      </div> */}
    </div>
  )
}
