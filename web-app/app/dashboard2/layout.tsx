import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f7f6fb] min-h-screen flex">
      <div className="ml-[246px] pl-[12px] flex-1">
        {children}
      </div>
    </div>
  );
}
