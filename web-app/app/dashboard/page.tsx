"use client";

import { useUserRoles } from '@/hooks/useUserRoles';
import { RoleGuard } from '@/components/RoleGuard';

function DashboardContent() {
  const { hasRole, isLoading, error } = useUserRoles();

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
      {error && (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-yellow-800">Notice</h3>
          <p className="text-yellow-700">Unable to load user roles: {error}</p>
        </div>
      )}

      {(hasRole('Manager') || hasRole('Admin')) && (
        <div className="bg-red-100 border border-red-300 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-red-800">Admin Panel</h3>
          <p className="text-red-700">You have administrator access.</p>
        </div>
      )}

    </div>
  );
}

export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={['Admin', 'Manager']}>
      <DashboardContent />
    </RoleGuard>
  );
}