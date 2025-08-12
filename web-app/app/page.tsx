"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";

const NAMESPACE = "https://grafikapp.dev/claims";

export default function HomeRedirect() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;

    // 🔍 DEBUG: Log user data
    console.log("User:", user);
    console.log("Roles:", user?.[`${NAMESPACE}/roles`]);

    if (user) {
      router.replace("/dashboard");

      /* // Check if user has required role (Admin or Manager)
      const roles = user[`${NAMESPACE}/roles`];
      const hasRequiredRole = roles?.includes("Admin") || roles?.includes("Manager");
      
      if (hasRequiredRole) {
        router.replace("/dashboard");
      }  */
      
    } else {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-lg">Loading...</div>
      </div>
    </div>
  );
}