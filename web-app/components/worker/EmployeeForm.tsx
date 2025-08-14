"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkers } from "@/lib/context/WorkersContext";
import type { WorkerRole, WorkerStatus } from "@/models/Worker";
import { Badge } from "@/components/ui/badge";

const roles: WorkerRole[] = ["Chef", "Manager", "Waiter", "Cleaner", "Other"];
const statuses: WorkerStatus[] = ["active", "leave", "inactive"];

interface FieldErrors { [k: string]: string | undefined }

export function EmployeeForm() {
  const { addWorker } = useWorkers();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    role: roles[0],
    status: statuses[0],
    email: "",
    phone: "",
    shifts: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const e: FieldErrors = {};
    if (!form.name.trim()) e.name = "Name required";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Invalid email";
    if (form.phone && form.phone.replace(/\D/g, "").length < 7) e.phone = "Phone too short";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const assigned = form.shifts
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .map(type => ({ type, length: 0 }));
      addWorker({
        name: form.name.trim(),
        role: form.role as WorkerRole,
        status: form.status as WorkerStatus,
        email: form.email || undefined,
        phone: form.phone || undefined,
        assignedShifts: assigned,
      });
      router.push("/workers");
    } finally {
      setSubmitting(false);
    }
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700"
          value={form.name}
          onChange={e => update("name", e.target.value)}
          placeholder="Employee name"
        />
        {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
            value={form.role}
            onChange={e => update("role", e.target.value as WorkerRole)}
          >
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700"
            value={form.status}
            onChange={e => update("status", e.target.value as WorkerStatus)}
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700"
            value={form.email}
            onChange={e => update("email", e.target.value)}
            placeholder="name@example.com"
            type="email"
          />
          {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700"
            value={form.phone}
            onChange={e => update("phone", e.target.value)}
            placeholder="+372..."
          />
          {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Assigned Shifts (comma separated)</label>
        <input
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-zinc-800 dark:border-zinc-700"
          value={form.shifts}
          onChange={e => update("shifts", e.target.value)}
          placeholder="Morning, Evening"
        />
        <p className="mt-1 text-xs text-zinc-500">Just labels for now; will map to real shift IDs later.</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-violet-500 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Employee"}
        </button>
        <button
          type="button"
            onClick={() => router.back()}
          className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700"
        >
          Cancel
        </button>
      </div>
      <div className="pt-4 text-xs text-zinc-500 flex flex-wrap gap-2">
        {roles.map(r => <Badge key={r} variant="outline">{r}</Badge>)}
      </div>
    </form>
  );
}
