import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AdminManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-(--color-surface) text-(--color-text)">
      <Header />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        <Sidebar />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
