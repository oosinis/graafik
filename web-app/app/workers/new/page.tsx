import React from "react";
import { EmployeeForm } from "@/components/worker/EmployeeForm";

export default function NewWorkerPage() {
  // We wrap this page in its own provider so navigation back to /workers (layout provider) still sees updates if root also wraps.
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Add New Employee</h1>
        <p className="text-sm text-zinc-500 mt-1">Create a worker record using mock persistence.</p>
      </div>
  <EmployeeForm />
    </div>
  );
}
