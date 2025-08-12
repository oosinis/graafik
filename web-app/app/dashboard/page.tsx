"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useUserRoles } from '@/hooks/useUserRoles';
import { RoleGuard } from '@/components/RoleGuard';

// Separate DashboardContent component
function DashboardContent() {
  const router = useRouter();
  const { roles, hasRole, isLoading, error } = useUserRoles();

  const activeWorkers = [
    { id: "1", name: "Sander Saar", role: "Vahetusevanem", time: "08:00–14:00" },
    { id: "2", name: "Mirjam Laane", role: "Vahetusevanem", time: "09:00–15:00" },
    // …add more…
  ];

  const notifications = [
    { id: "1", message: "Mirjam Laane has updated her availability", time: "2h ago" },
    { id: "2", message: "New shift assigned to Sander Saar", time: "5h ago" },
    // …add more…
  ];

  const upcomingShifts = [
    { id: "1", worker: "Sander Saar", role: "Vahetusevanem", start: "08:00", end: "14:00", color: "bg-pink-200" },
    { id: "2", worker: "Mirjam Laane", role: "Vahetusevanem", start: "09:00", end: "15:00", color: "bg-purple-200" },
    // …add more…
  ];

  // Optional: Show loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Ettevõtte Nimi OÜ</h1>

      {error && (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-yellow-800">Notice</h3>
          <p className="text-yellow-700">Unable to load user roles: {error}</p>
        </div>
      )}

      {hasRole('Manager') && (
        <div className="bg-red-100 border border-red-300 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-red-800">Admin Panel</h3>
          <p className="text-red-700">You have administrator access.</p>
        </div>
      )}
    </div>
  );
}

// Main Dashboard Page component
export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={['Admin', 'Manager']}>
      <DashboardContent />
    </RoleGuard>
  );
}