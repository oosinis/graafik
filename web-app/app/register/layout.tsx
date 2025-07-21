// app/register/layout.tsx
import React from "react";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // full-screen gray background container
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      {children}
    </div>
  );
}
