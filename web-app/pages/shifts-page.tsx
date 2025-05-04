import { ShiftOverview } from "@/components/shift-overview"
import { PageHeader } from "@/components/page-header"

export default function ShiftsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Vahetuste Ülevaade" />
      <ShiftOverview />
    </div>
  )
}
