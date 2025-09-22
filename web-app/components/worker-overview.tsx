/* "use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { WorkerStatus } from "@/models/Worker"
import { useWorkers } from "@/lib/context/WorkersContext"

interface StatusMeta {
  label: string
  variant: "success" | "warning" | "destructive" | "secondary"
}
const statusMeta: Record<WorkerStatus, StatusMeta> = {
  active: { label: "Active", variant: "success" },
  leave: { label: "Leave", variant: "warning" },
  inactive: { label: "Inactive", variant: "secondary" },
}

export function WorkerOverview() {
  const { workers } = useWorkers()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<WorkerStatus | "all">("all")

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return workers.filter((w) => {
      if (statusFilter !== "all" && w.status !== statusFilter) return false
      if (!term) return true
      return (
        w.name.toLowerCase().includes(term) ||
        w.role.toLowerCase().includes(term) ||
        w.assignedShifts.some((s) => s.type.toLowerCase().includes(term))
      )
    })
  }, [workers, search, statusFilter])

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-2xl">Employees</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              placeholder="Search name, role or shift..."
              className="flex-1 md:w-64 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              aria-label="Status filter"
              className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm shadow-sm dark:bg-zinc-800 dark:border-zinc-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as WorkerStatus | "all")}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="leave">Leave</option>
              <option value="inactive">Inactive</option>
            </select>
            <a
              href="/workers/new"
              className="inline-flex items-center justify-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              Add Employee
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Name</TableHead>
              <TableHead className="w-[140px]">Role</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead>Assigned Shifts</TableHead>
              <TableHead className="hidden md:table-cell w-[200px]">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-zinc-500">
                  No employees match your search.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((worker) => {
              const meta = statusMeta[worker.status]
              return (
                <TableRow key={worker.id}>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell>
                    <Badge variant="purple">{worker.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {worker.assignedShifts.map((s) => s.type).join(", ") || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-zinc-600 dark:text-zinc-300">
                    {worker.email && <div>{worker.email}</div>}
                    {worker.phone && <div>{worker.phone}</div>}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
 */