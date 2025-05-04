"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Shift } from "@/models/Shift"

const mockShifts: Shift[] = [
  {
    type: "Hommik",
    length: 8,
    rules: [{ priority: "high", daysApplied: [1, 2, 3, 4, 5], perDay: 1, restDays: 0, continuousDays: 5 }],
  },
  {
    type: "Päev",
    length: 6,
    rules: [{ priority: "medium", daysApplied: [1, 2, 3, 4, 5], perDay: 1, restDays: 0, continuousDays: 5 }],
  },
  {
    type: "Õhtu",
    length: 8,
    rules: [{ priority: "low", daysApplied: [1, 2, 3, 4, 5, 6, 7], perDay: 1, restDays: 1, continuousDays: 3 }],
  },
  {
    type: "Öö",
    length: 10,
    rules: [{ priority: "high", daysApplied: [1, 2, 3, 4, 5, 6, 7], perDay: 1, restDays: 2, continuousDays: 4 }],
  },
]

const priorityLabels = {
  low: "Madal",
  medium: "Keskmine",
  high: "Kõrge",
}

export function ShiftOverview() {
  const [shifts, setShifts] = useState<Shift[]>([])

  useEffect(() => {
    setShifts(mockShifts)
  }, [])

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Vahetused</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tüüp</TableHead>
              <TableHead>Pikkus (tundi)</TableHead>
              <TableHead>Reeglid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift, index) => (
              <TableRow key={index}>
                <TableCell>{shift.type}</TableCell>
                <TableCell>{shift.length}</TableCell>
                <TableCell>
                  {shift.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="mb-2">
                      <p>Prioriteet: {priorityLabels[rule.priority]}</p>
                      <p>Päevad: {rule.daysApplied.join(", ")}</p>
                      <p>
                        Vahetusi päevas: {rule.perDay}, Puhkepäevi: {rule.restDays}, Järjestikuseid päevi:{" "}
                        {rule.continuousDays}
                      </p>
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
