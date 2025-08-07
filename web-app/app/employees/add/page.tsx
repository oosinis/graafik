// web‑app/app/employees/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
} from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEmployees } from "@/lib/context/EmployeesContext";

export default function AddEmployeePage() {
  const router = useRouter();
  const { addEmployee } = useEmployees();

  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");

  // Employment Details
  const [primaryRole,   setPrimaryRole]   = useState("");
  const [secondaryRole, setSecondaryRole] = useState("");
  const [fte,           setFte]           = useState<
    "1.0" | "0.75" | "0.5" | "0.25" | "other"
  >("1.0");

  // Preferences
  const shiftOptions = [
    "Morning",
    "Day",
    "Evening",
    "None",
  ] as const;
  const [preferredShifts, setPreferredShifts] = useState<string[]>([]);
  const workdayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ] as const;
  const [preferredWorkdays, setPreferredWorkdays] = useState<string[]>(
    []
  );

  // Additional Notes
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      id:    Date.now().toString(),
      name:  `${firstName} ${lastName}`,
      role:  primaryRole,
      fte:   parseFloat(fte),
      email,
      phone,
      // you can also persist notes, secondaryRole, preferredShifts, preferredWorkdays…
    });
    router.push("/employees");
  };

  return (
    <div className="flex h-screen items-start justify-center bg-gray-50 pt-16">
      <Card className="w-full max-w-4xl">
        <form onSubmit={handleSubmit}>

          {/* Page title */}
          <CardHeader>
            <h2 className="text-2xl font-bold">Add A New Employee</h2>
          </CardHeader>

          {/* Personal Info & Employment Details */}
          <CardContent className="space-y-8">

            {/* Personal Info */}
            <section className="space-y-4">
              <h3 className="font-medium text-lg">Personal Info</h3>
              {[
                { label: "First Name", value: firstName, onChange: (v: string) => setFirstName(v) },
                { label: "Last Name",  value: lastName,  onChange: (v: string) => setLastName(v) },
                { label: "Work Email", value: email,     onChange: (v: string) => setEmail(v), type: "email" },
                { label: "Phone Number", value: phone,   onChange: (v: string) => setPhone(v) },
              ].map(({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <Input
                    type={type}
                    placeholder={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                  />
                </div>
              ))}
            </section>

            {/* Employment Details */}
            <section className="space-y-4">
              <h3 className="font-medium text-lg">Employment Details</h3>

              {/* Primary Role */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Primary Role
                </label>
                <Select
                  value={primaryRole}
                  onValueChange={setPrimaryRole}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Kokk","Vahetusevanem","Ettekandja"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Secondary Role */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Secondary Role
                </label>
                <Select
                  value={secondaryRole}
                  onValueChange={setSecondaryRole}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {["None","Kokk","Vahetusevanem","Ettekandja"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employment Type */}
              <div>
                <p className="mb-1 text-sm font-medium">
                  Employment Type
                </p>
                <div className="flex gap-2 flex-wrap">
                  {["1.0","0.75","0.5","0.25","other"].map((opt) => (
                    <Button
                      key={opt}
                      size="sm"
                      variant={fte === opt ? "default" : "outline"}
                      onClick={() => setFte(opt as "1.0" | "0.75" | "0.5" | "0.25" | "other")}
                    >
                      {opt} FTE
                    </Button>
                  ))}
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section className="space-y-4">
              <h3 className="font-medium text-lg">Preferences</h3>

              {/* Preferred Shifts */}
              <div>
                <p className="mb-1 text-sm font-medium">
                  Preferred Shifts{" "}
                  <span className="text-gray-500">(Morning – None)</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {shiftOptions.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={
                        preferredShifts.includes(s)
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setPreferredShifts((prev) =>
                          prev.includes(s)
                            ? prev.filter((x) => x !== s)
                            : [...prev, s]
                        )
                      }
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Preferred Workdays */}
              <div>
                <p className="mb-1 text-sm font-medium">
                  Preferred Workdays{" "}
                  <span className="text-gray-500">(Monday – Sunday)</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {workdayOptions.map((d) => (
                    <Button
                      key={d}
                      size="sm"
                      variant={
                        preferredWorkdays.includes(d)
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setPreferredWorkdays((prev) =>
                          prev.includes(d)
                            ? prev.filter((x) => x !== d)
                            : [...prev, d]
                        )
                      }
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>
            </section>

            {/* Additional Notes */}
            <section>
              <label className="block text-sm font-medium mb-1">
                Additional Notes
              </label>
              <textarea
                className="w-full rounded border p-2"
                placeholder="Anything else…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </section>
          </CardContent>

          {/* Footer buttons */}
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Discard
            </Button>
            <Button type="submit">Save &amp; Add</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}