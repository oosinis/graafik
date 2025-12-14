export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[1200px] mx-auto w-full">{children}</div>
    </main>
  );
}
