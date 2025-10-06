'use client';

import AdminLayout from '@/app/components/adminlayout';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

interface Category {
  id?: number;
  name: string;
  description?: string;
}

export default function CategoryFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idParam) {
      const fetchCategory = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/categories/${idParam}`);
          if (!res.ok) throw new Error('ไม่พบข้อมูลหมวดหมู่');
          const data: Category = await res.json();
          setName(data.name);
          setDescription(data.description || '');
        } catch (err: any) {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: err.message || 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้',
            confirmButtonText: 'ตรวจสอบอีกครั้ง',
            confirmButtonColor: '#b91c1c',
          });
        }
      };
      fetchCategory();
    }
  }, [idParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const category: Category = { name, description };

    try {
      if (idParam) {
        // PUT - แก้ไขหมวดหมู่
        const res = await fetch(`http://localhost:5000/api/categories/${idParam}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category),
        });
        if (!res.ok) throw new Error('แก้ไขหมวดหมู่ล้มเหลว');
        
        await Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'แก้ไขหมวดหมู่เรียบร้อยแล้ว',
          confirmButtonText: 'OK',
          confirmButtonColor: '#b91c1c',
        });
      } else {
        // POST - เพิ่มหมวดหมู่ใหม่
        const res = await fetch(`http://localhost:5000/api/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(category),
        });
        if (!res.ok) throw new Error('สร้างหมวดหมู่ล้มเหลว');
        
        await Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'เพิ่มหมวดหมู่เรียบร้อยแล้ว',
          confirmButtonText: 'OK',
          confirmButtonColor: '#b91c1c',
        });
      }

      router.push('/admin/add-catagories');
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: err.message || 'ไม่สามารถบันทึกข้อมูลได้',
        confirmButtonText: 'ลองอีกครั้ง',
        confirmButtonColor: '#b91c1c',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          {idParam ? 'แก้ไขหมวดหมู่' : 'สร้างหมวดหมู่ใหม่'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <div>
            <label className="block mb-1 font-semibold text-sm sm:text-base">ชื่อหมวดหมู่</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
              placeholder="เช่น ไอศกรีม, เครื่องดื่ม"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm sm:text-base">คำอธิบาย</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
              placeholder="รายละเอียดของหมวดหมู่ (ถ้ามี)"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 text-white py-2 sm:py-3 rounded-full font-semibold transition-colors cursor-pointer disabled:opacity-50 text-base sm:text-lg"
          >
            {loading ? 'กำลังบันทึก...' : idParam ? 'บันทึกการแก้ไข' : 'บันทึกหมวดหมู่'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}