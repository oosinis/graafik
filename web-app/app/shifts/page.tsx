// web‑app/app/shifts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Table, Column } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Shift } from "@/lib/utils";

export default function ShiftsPage() {
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with real API call
    const mock: Shift[] = [
      {
        id: "1",
        title: "Morning regular",
        from: "08:00",
        to: "14:00",
        roles: ["Kokk", "Vahetusevanem"],
        rulesCount: 3,
      },
      {
        id: "2",
        title: "Day regular",
        from: "12:00",
        to: "16:00",
        roles: ["Ettekandja"],
        rulesCount: 2,
      },
      // …more…
    ];
    setShifts(mock);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading shifts…</p>;

  const columns: Column<Shift>[] = [
    { header: "", accessor: "select" },
    { header: "Shift title", accessor: "title" },
    { header: "Time (from–to)", accessor: "time" },
    { header: "Role", accessor: "role" },
    { header: "Rules", accessor: "rules" },
    { header: "", accessor: "actions" },
  ];

  const data = shifts.map((s) => ({
    select: <input type="checkbox" className="h-4 w-4" />,
    title: s.title,
    time: `${s.from}–${s.to}`,
    role: (
      <div className="flex space-x-1">
        {s.roles.map((r) => (
          <span key={r} className="px-2 py-1 bg-indigo-100 rounded text-xs">
            {r}
          </span>
        ))}
      </div>
    ),
    rules: s.rulesCount,
    actions: (
      <Button variant="ghost" size="sm" onClick={() => {/* TODO: open edit */}}>
        ✎
      </Button>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shift Details</h1>
        <Button onClick={() => router.push("/shifts/add")}>
          Add a Shift +
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
}