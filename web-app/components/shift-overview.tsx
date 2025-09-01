"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "./ui/badge"
import type { WorkerRole } from "@/models/Worker"
import type { Shift } from "@/models/Shift"
import { useShifts } from "@/lib/context/ShiftsContext"

const priorityLabel: Record<string, string> = { low: "Low", medium: "Medium", high: "High" }

export function ShiftOverview() {
  const { shifts } = useShifts()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<WorkerRole | "all">("all")

  const allRoles = useMemo<WorkerRole[]>(() => {
    const set = new Set<WorkerRole>()
    shifts.forEach((s) => s.roles.forEach((r) => set.add(r)))
    return Array.from(set)
  }, [shifts])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return shifts.filter((s) => {
      if (roleFilter !== "all" && !s.roles.includes(roleFilter)) return false
      if (!term) return true
      return (
        s.type.toLowerCase().includes(term) ||
        s.roles.some((r) => r.toLowerCase().includes(term)) ||
        (s.rules || []).some((r) => priorityLabel[r.priority].toLowerCase().includes(term))
      )
    })
  }, [shifts, search, roleFilter])

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-[15px] font-semibold tracking-tight">Shift Details</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                placeholder="Search"
                className="h-8 w-44 rounded-md border border-zinc-300 bg-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              aria-label="Role filter"
              className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as WorkerRole | "all")}
            >
              <option value="all">Role All</option>
              {allRoles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <a
              href="/shifts/new"
              className="h-8 inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 text-xs font-medium text-white hover:bg-violet-500"
            >
              <span>Add a Shift</span>
              <span className="text-base leading-none">+</span>
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="text-[11px] uppercase tracking-wide text-zinc-500">
              <TableHead className="w-6 p-2"></TableHead>
              <TableHead className="w-[160px] font-medium text-zinc-700">Shift Title</TableHead>
              <TableHead className="w-[120px] font-medium text-zinc-700">Time (from-to)</TableHead>
              <TableHead className="w-[160px] font-medium text-zinc-700">Role</TableHead>
              <TableHead className="w-[160px] font-medium text-zinc-700">Rule Title</TableHead>
              <TableHead className="w-[80px] font-medium text-zinc-700">Priority</TableHead>
              <TableHead className="w-[130px] font-medium text-zinc-700">Days</TableHead>
              <TableHead className="w-[70px] font-medium text-zinc-700 text-center">Shifts/Day</TableHead>
              <TableHead className="w-[90px] font-medium text-zinc-700 text-center">Off-days After</TableHead>
              <TableHead className="w-[120px] font-medium text-zinc-700 text-center">Max Continuous</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} className="py-10 text-center text-sm text-zinc-500">
                  No shifts match your search.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((shift: Shift) => {
              const rules = shift.rules || []
              const primaryRule = rules[0]
              return (
                <TableRow key={shift.id} className="hover:bg-violet-50/40">
                  <TableCell className="p-2 align-top">
                    <input type="checkbox" className="h-3 w-3 rounded border-zinc-300" />
                  </TableCell>
                  <TableCell className="align-top py-3 text-xs font-medium text-zinc-900">{shift.type}{rules.length>1 && <span className="ml-1 text-[10px] text-zinc-400">+{rules.length-1}</span>}</TableCell>
                  <TableCell className="align-top py-3 text-[11px] text-zinc-700 whitespace-nowrap">{shift.start}-{shift.end}</TableCell>
                  <TableCell className="align-top py-3">
                    <div className="flex flex-wrap gap-1">
                      {shift.roles.map((r) => (
                        <Badge key={r} variant="outline" className="border-violet-200 bg-violet-50 text-[10px] font-medium text-violet-700">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="align-top py-3 text-[11px] text-zinc-700">
                    {primaryRule ? `Max ${primaryRule.perDay} ${shift.type.toLowerCase()} shift` : <span className="text-zinc-400">—</span>}
                  </TableCell>
                  <TableCell className="align-top py-3 text-[11px] text-zinc-700">
                    {primaryRule ? priorityLabel[primaryRule.priority] : <span className="text-zinc-400">—</span>}
                  </TableCell>
                  <TableCell className="align-top py-3 text-[11px] text-zinc-700">
                    {primaryRule ? primaryRule.daysApplied.map(d=>["Mo","Tu","We","Th","Fr","Sa","Su"][d]).join(", ") : <span className="text-zinc-400">—</span>}
                  </TableCell>
                  <TableCell className="align-top py-3 text-center text-[11px] text-zinc-700">
                    {primaryRule ? primaryRule.perDay : <span className="text-zinc-400">—</span>}
                  </TableCell>
                  <TableCell className="align-top py-3 text-center text-[11px] text-zinc-700">
                    {primaryRule ? primaryRule.restDays : <span className="text-zinc-400">—</span>}
                  </TableCell>
                  <TableCell className="align-top py-3 text-center text-[11px] text-zinc-700">
                    {primaryRule ? primaryRule.continuousDays : <span className="text-zinc-400">—</span>}
                  </TableCell>
                  <TableCell className="align-top py-3 text-right text-[12px] pr-4">
                    <div className="flex justify-end gap-2 text-zinc-400">
                      <button aria-label="Edit" className="hover:text-violet-600">✎</button>
                      <button aria-label="Clone" className="hover:text-violet-600">⧉</button>
                    </div>
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
