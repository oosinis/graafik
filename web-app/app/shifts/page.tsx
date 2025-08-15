import { ShiftOverview } from "@/components/shift-overview";
import { PageHeader } from "@/components/page-header";

export default function ShiftsRoute() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Shift Overview" />
      <ShiftOverview />
    </div>
  );
}
