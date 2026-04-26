"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/auth/login');
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen bg-(--color-surface) text-(--color-text)">
      <Header isAdmin />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr] pt-14">
        <Sidebar />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
