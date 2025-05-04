"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Worker } from "@/models/Worker"

const mockWorkers: Worker[] = [
  {
    name: "Jaan Tamm",
    assignedShifts: [
      { type: "Hommik", length: 8 },
      { type: "Õhtu", length: 8 },
    ],
  },
  { name: "Mari Mets", assignedShifts: [{ type: "Öö", length: 10 }] },
  {
    name: "Peeter Kask",
    assignedShifts: [
      { type: "Päev", length: 6 },
      { type: "Õhtu", length: 8 },
    ],
  },
]

export function WorkerOverview() {
  const [workers, setWorkers] = useState<Worker[]>([])

  useEffect(() => {
    setWorkers(mockWorkers)
  }, [])

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Töötajad</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nimi</TableHead>
              <TableHead>Määratud Vahetused</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.map((worker, index) => (
              <TableRow key={index}>
                <TableCell>{worker.name}</TableCell>
                <TableCell>{worker.assignedShifts.map((shift) => shift.type).join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
