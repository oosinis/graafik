//...pages/dashboard-page

"use client"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { EstablishmentGrid } from "@/components/establishment-grid"

// Updated mock data for establishments
const establishments = [
  { id: "1", name: "Asutus 1" },
  { id: "2", name: "Asutus 2" },
  { id: "3", name: "Asutus 3" },
  { id: "4", name: "Asutus 4" },
]

export default function DashboardPage() {
  const router = useRouter()

  const handleEstablishmentClick = (id: string) => {
    const currentDate = new Date()
    router.push(`/schedule?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}&establishment=${id}`)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Ettevõtte Nimi OÜ" />
      <EstablishmentGrid establishments={establishments} onEstablishmentClick={handleEstablishmentClick} />
    </div>
  )
}
