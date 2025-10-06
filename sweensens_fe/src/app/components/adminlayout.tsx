"use client";
import AdminSidebar from "../components/adminsidebar";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-white p-4 sm:p-6 lg:p-8 w-full lg:w-auto">
        <div className="pt-12 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}