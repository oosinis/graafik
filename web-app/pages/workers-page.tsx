import { WorkerOverview } from "@/components/worker-overview"
import { PageHeader } from "@/components/page-header"

export default function WorkersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Töötajate Ülevaade" />
      <WorkerOverview />
    </div>
  )
}
