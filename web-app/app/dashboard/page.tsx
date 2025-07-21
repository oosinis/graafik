"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// Mock data for establishments
const establishments = [
  { id: "1", name: "Restoran Mere" },
  { id: "2", name: "Restoran Mets" },
  { id: "3", name: "Restoran Linn" },
  { id: "4", name: "Restoran Järv" },
];

export default function DashboardPage() {
  const router = useRouter();

  const handleEstablishmentClick = (id: string) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    router.push(`/schedule/${year}/${month}?establishment=${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Ettevõtte Nimi OÜ</h1>
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
