// app/employees/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { Card } from "@/components/ui/card";
import { Table, Column } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/lib/utils";

export default function EmployeesPage() {
  const router = useRouter();                           
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mock: Employee[] = [
      { id: "1", name: "Astrid Laane",    role: "Kokk",          fte: 1,    email: "astrid@gmail.com",       phone: "5123 4567" },
      { id: "2", name: "Denis Saar",      role: "Vahetusevanem", fte: 0.75, email: "denis01@gmail.com",       phone: "5432 2324" },
      { id: "3", name: "Gregor Ojamets",  role: "Ettekandja",    fte: 0.5,  email: "ojametsgregor@gmail.com", phone: "5544 0987" },
    ];
    setEmployees(mock);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading…</p>;

  const columns: Column<Employee>[] = [
    { header: "",       accessor: "select"  },
    { header: "Name",   accessor: "name"    },
    { header: "Role",   accessor: "role"    },
    { header: "FTE",    accessor: "fte"     },
    { header: "Email",  accessor: "email"   },
    { header: "Phone",  accessor: "phone"   },
    { header: "",       accessor: "actions" },
  ];

  const data = employees.map(emp => ({
    select:  <input type="checkbox" />,
    name:     emp.name,
    role:     <span className="inline-block px-2 py-1 bg-indigo-100 rounded text-xs">{emp.role}</span>,
    fte:      emp.fte.toFixed(2),
    email:    emp.email,
    phone:    emp.phone,
    actions:  <Button variant="ghost">⋯</Button>,
  }));

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button onClick={() => router.push("/employees/add")}>  {/* ← updated */}
          Add Employee +
        </Button>
      </div>
      <Card>
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
}