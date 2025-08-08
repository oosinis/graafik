import { MonthsHoursStep } from "@/components/monthsHoursStep"
import { ShiftDetailsStep } from "@/components/ShiftDetailsStep"
import { RuleDetailsStep } from "@/components/RuleDetailsStep"
import { AssignEmployeesStep } from "@/components/AssignEmployeesStep"
import { PageHeader } from "@/components/page-header"

export default function GeneratorRoute() {
  /* TODO: fullTimeYear and month info needs to be saved here and communicated to the components that 
  use them */
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Graafiku Generaator" description="Loo uus töögraafik" />
      <MonthsHoursStep />
      <ShiftDetailsStep />
      <RuleDetailsStep />
      <AssignEmployeesStep />
    </div>
  )
}
