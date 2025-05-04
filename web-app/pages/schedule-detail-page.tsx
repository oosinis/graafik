import { CalendarView } from "@/components/calendar-view"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import type { ScheduleResponse } from "@/models/ScheduleResponse"

const monthNames = [
  "Jaanuar",
  "Veebruar",
  "Märts",
  "Aprill",
  "Mai",
  "Juuni",
  "Juuli",
  "August",
  "September",
  "Oktoober",
  "November",
  "Detsember",
]

// This is a mock function to fetch schedule data
// In a real application, you would fetch this data from your API
async function getSchedule(year: number, month: number): Promise<ScheduleResponse | null> {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const daysInMonth = new Date(year, month, 0).getDate()

  // Simulating a case where a schedule might not exist for a given month
  if (month > 12 || month < 1) {
    return null
  }

  const shiftTypes = ["Hommik", "Päev", "Õhtu", "Öö"]
  const workers = ["Jaan Tamm", "Mari Mets", "Peeter Kask", "Liis Lepp", "Kati Kuusk", "Andres Allik", "Tiina Toom"]
  const workerHours: Record<string, number> = {}

  // Initialize worker hours
  workers.forEach((worker) => {
    workerHours[worker] = Math.floor(Math.random() * 40) + 140 // 140-180 hours
  })

  // Generate specific mock data for February 2025 with exactly one of each shift type per day
  if (year === 2025 && month === 2) {
    let workerIndex = 0
    return {
      month,
      year,
      score: 95,
      workerHours,
      daySchedules: Array.from({ length: daysInMonth }, (_, dayIndex) => {
        const assignments = shiftTypes.map((type) => {
          const assignment = {
            shift: { type, length: type === "Öö" ? 10 : 8 },
            worker: { name: workers[workerIndex] },
          }
          workerIndex = (workerIndex + 1) % workers.length
          return assignment
        })
        return {
          dayOfMonth: dayIndex + 1,
          assignments: assignments,
          score: Math.floor(Math.random() * 100),
        }
      }),
    }
  }

  // Default mock data for other months
  return {
    month,
    year,
    score: 85,
    workerHours,
    daySchedules: Array.from({ length: daysInMonth }, (_, i) => ({
      dayOfMonth: i + 1,
      score: Math.floor(Math.random() * 100),
      assignments: [
        { shift: { type: "Hommik", length: 8 }, worker: { name: "Jaan Tamm" } },
        { shift: { type: "Päev", length: 8 }, worker: { name: "Mari Mets" } },
        { shift: { type: "Õhtu", length: 8 }, worker: { name: "Peeter Kask" } },
        { shift: { type: "Öö", length: 8 }, worker: { name: "Liis Lepp" } },
      ],
    })),
  }
}

export default async function ScheduleDetailPage({ params }: { params: { year: string; month: string } }) {
  const year = Number.parseInt(params.year, 10)
  const month = Number.parseInt(params.month, 10)

  const schedule = await getSchedule(year, month)

  if (!schedule) {
    notFound()
  }

  return (
    <div className="w-full">
      <PageHeader title={`${monthNames[month - 1]} ${year}`} />
      <CalendarView schedule={schedule} />
      <div className="mt-4 text-sm text-gray-600">
        <p>Vahetuste tüübid:</p>
        <ul>
          <li>Hommik: 8 tundi</li>
          <li>Päev: 8 tundi</li>
          <li>Õhtu: 8 tundi</li>
          <li>Öö: 8 tundi</li>
        </ul>
      </div>
    </div>
  )
}
