import { MultiStepPlanner } from "@/components/multi-step-planner"
import { PageHeader } from "@/components/page-header"

export default function GeneratorPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Graafiku Generaator" description="Loo uus töögraafik" />
      <MultiStepPlanner />
    </div>
  )
}
 