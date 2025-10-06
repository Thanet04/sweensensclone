'use client';

import AdminLayout from '@/app/components/adminlayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LuPencil } from 'react-icons/lu';
import { MdOutlineDelete } from 'react-icons/md';
import Swal from 'sweetalert2';

interface Category {
  id: number;
  name: string;
  description?: string;
}

export default function CategoryListPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  // ดึงข้อมูลจาก API
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (err: any) {
      Swal.fire('ผิดพลาด', err.message, 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ลบหมวดหมู่
  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${id}`, 
          { method: 'DELETE' });
          if (!res.ok) throw new Error('ลบหมวดหมู่ล้มเหลว');
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
          Swal.fire('ลบสำเร็จ!', 'หมวดหมู่ถูกลบเรียบร้อยแล้ว', 'success');
        } catch (err: any) {
          Swal.fire('ผิดพลาด', err.message, 'error');
        }
      }
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">หมวดหมู่สินค้า</h1>
          <button
            className="bg-red-700 text-white px-4 py-2 rounded-full cursor-pointer"
            onClick={() => router.push('/admin/add-products/create')}
          >
            สร้างหมวดหมู่ใหม่
          </button>
        </div>

        <table className="w-full table-auto bg-white rounded-xl shadow-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ชื่อหมวดหมู่</th>
              <th className="p-3 text-left">คำอธิบาย</th>
              <th className="p-3">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b">
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.description || '-'}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    className="py-1 text-blue-500 rounded-lg cursor-pointer"
                    onClick={() => router.push(`/admin/add-products/create?id=${cat.id}`)}
                  >
                    <LuPencil className="w-5 h-5" />
                  </button>
                  <button
                    className="py-1 text-red-500 rounded-lg cursor-pointer"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <MdOutlineDelete className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
