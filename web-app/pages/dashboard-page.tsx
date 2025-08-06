"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { PageHeader } from "@/components/page-header";
import { EstablishmentGrid } from "@/components/establishment-grid";

const establishments = [
  { id: "1", name: "Asutus 1" },
  { id: "2", name: "Asutus 2" },
  { id: "3", name: "Asutus 3" },
  { id: "4", name: "Asutus 4" },
];

const NAMESPACE = "https://grafikapp.dev/claims"; // Make sure this matches the custom claim in Auth0

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && (!user || !user[`${NAMESPACE}/roles`]?.includes("admin"))) {
      router.replace("/unauthorized");
    }
  }, [user, isLoading, router]);

  const handleEstablishmentClick = (id: string) => {
    const currentDate = new Date();
    router.push(`/schedule?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}&establishment=${id}`);
  };

  if (isLoading || !user) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Ettevõtte Nimi OÜ" />
      <EstablishmentGrid establishments={establishments} onEstablishmentClick={handleEstablishmentClick} />
    </div>
  );
}
