"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useUserRoles } from '@/hooks/useUserRoles';
import { RoleGuard } from '@/components/RoleGuard';

// Mock data for establishments
const establishments = [
  { id: "1", name: "Restoran Mere" },
  { id: "2", name: "Restoran Mets" },
  { id: "3", name: "Restoran Linn" },
  { id: "4", name: "Restoran Järv" },
];

function DashboardContent() {
  const router = useRouter();
  const { roles, hasRole, isLoading, error } = useUserRoles();

  const handleEstablishmentClick = (id: string) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    router.push(`/schedule/${year}/${month}?establishment=${id}`);
  };

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {establishments.map((establishment) => (
          <Card
            key={establishment.id}
            className="hover:bg-accent cursor-pointer transition-colors"
            onClick={() => handleEstablishmentClick(establishment.id)}
          >
            <CardHeader>
              <CardTitle className="text-xl text-center">
                {establishment.name}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
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