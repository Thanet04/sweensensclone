"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {!isOpen && (
        <button onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md shadow-lg"
          aria-label="Open menu" >
          <Menu size={24} />
        </button>
      )}

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}
      <aside
        className={`fixed lg:static top-0 left-0 w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-white"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/admin"
            className="hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={closeSidebar}
          >
            Dashboard
          </Link>
          <Link href="/admin/add-catagories"
            className="hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={closeSidebar}
          >
            หมวดหมู่
          </Link>
          <Link href="/admin/add-products"
            className="hover:bg-gray-700 p-3 rounded transition-colors"
            onClick={closeSidebar}
          >
            เพิ่มสินค้า
          </Link>
        </nav>
      </aside>
    </>
  );
}