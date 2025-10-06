'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import banner from "../image/register-banner.webp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2"; 

interface FormData {
  first_name: string;
  last_name: string;
  phone: string;
  birthday: Date | null;
  email?: string;
  gender: string;
}

export default function Register() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    phone: "",
    birthday: null,
    email: "",
    gender: "male",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, birthday: startDate }),
      });

      const data = await res.json();
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: data.error || "สมัครสมาชิกไม่สำเร็จ",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ",
        text: "โปรดตั้งรหัส PIN",
        confirmButtonText: "ต่อไป",
      }).then(() => {
        sessionStorage.setItem("phone", formData.phone);
        router.push(`/Register/create_pin`);
      });

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
      });
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100">
      <div className="flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl flex flex-col justify-center">
          <button className="flex items-center text-gray-600 text-lg font-bold hover:text-red-600 mb-4 cursor-pointer">
            <ChevronLeft className="w-5 h-5 mr-1" />
            กลับ
          </button>

          <h1 className="text-3xl font-bold mb-4">สมัครสมาชิกฟรี! รับสิทธิประโยชน์และส่วนลดมากมาย</h1>
          <form className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อ <span className="text-red-500">*</span></label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="ชื่อ" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">นามสกุล <span className="text-red-500">*</span></label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="นามสกุล" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" maxLength={10} value={formData.phone} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="เบอร์โทรศัพท์" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">วันเกิด <span className="text-red-500">*</span></label>
              <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} dateFormat="dd/MM/yyyy" placeholderText="วว/ดด/ปปปป" className="w-full border rounded-lg px-3 py-2" showMonthDropdown showYearDropdown dropdownMode="select" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">อีเมล (ไม่ระบุได้)</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="อีเมล (ไม่ระบุได้)" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">เพศ <span className="text-red-500">*</span></label>
              <div className="flex gap-4 mt-3">
                {["male", "female", "other"].map(g => (
                  <label key={g} className="flex items-center gap-1">
                    <input type="radio" name="gender" value={g} checked={formData.gender===g} onChange={handleChange} />
                    {g==="male"?"ชาย":g==="female"?"หญิง":"ไม่ระบุ"}
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <button type="submit" className="w-full rounded-full border p-3 cursor-pointer transition bg-red-600 text-white hover:bg-red-500">
                สร้างบัญชี
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="h-full overflow-hidden shadow-lg hidden md:block">
        <Image src={banner} alt="Banner" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}
