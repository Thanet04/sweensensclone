'use client'

import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import banner from "../../image/register-banner.webp";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { useLanguage } from "@/app/Lang/Lang";

export default function CreatePin() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [phone, setPhone] = useState<string>("");
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const pinRef = useRef<HTMLInputElement[]>([]);
  const confirmRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const storedPhone = sessionStorage.getItem("phone");
    if (!storedPhone) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่พบข้อมูลผู้ใช้ โปรดกลับไปสมัครสมาชิกใหม่",
      }).then(() => {
        router.push("/Register");
      });
    } else {
      setPhone(storedPhone);
    }
  }, [router]);

  const handleChange = (arr: string[], setArr: any, idx: number, value: string, refs: React.RefObject<HTMLInputElement[]>) => {
    const val = value.replace(/\D/g, "");
    if (!val) return;

    const newArr = [...arr];
    newArr[idx] = val[0];
    setArr(newArr);

    if (idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (
    arr: string[],
    setArr: any,
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
    refs: React.RefObject<HTMLInputElement[]>
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newArr = [...arr];
      if (newArr[idx]) {
        newArr[idx] = "";
        setArr(newArr);
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
        newArr[idx - 1] = "";
        setArr(newArr);
      }
    }
  };

  const isPinComplete = pin.join("").length === 6 && confirmPin.join("").length === 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPinComplete) return;

    const pinStr = pin.join("");
    const confirmStr = confirmPin.join("");

    if (pinStr !== confirmStr) {
      Swal.fire({
        icon: "error",
        title: "PIN ไม่ตรงกัน",
        text: "กรุณากรอก PIN ให้ตรงกัน"
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/set-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin: pinStr }),
      });
      const data = await res.json();
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: data.error || "ตั้งรหัส PIN ไม่สำเร็จ"
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "ตั้งรหัส PIN สำเร็จ!",
          confirmButtonText: "ไปหน้าเข้าสู่ระบบ"
        }).then(() => {
          router.push("/login");
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ตั้งรหัส PIN ไม่สำเร็จ"
      });
    }
  };

  return (
    <>
    <Navbar onCartClick={() => {}} />
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100">
      
      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col justify-center">

          <div className="flex items-center my-4 p-1 hover:bg-gray-100 rounded-lg w-20 cursor-pointer">
            <ChevronLeft className="w-5 h-5 font-bold"/>
            <button className="text-lg font-bold cursor-pointer" onClick={() => router.push("/Register")}>
            {lang === "TH" ? "กลับ" : "Back"}
            </button>
          </div>

          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            {lang === "TH" ? "ตั้งรหัส PIN 6 หลัก" : "Set PIN 6 digits"}
          </h1>
          <p className="text-md my-2">รหัส PIN 6 หลักนี้จะช่วยให้คุณทำกิจกรรมได้ปลอดภัยยิ่งขึ้น</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* PIN Inputs */}
            <div>
              <label className="block text-md font-medium text-gray-600 mb-2">{lang === "TH" ? "สร้างรหัส PIN" : "Set PIN"}</label>
              <div className="flex justify-between">
                {pin.map((p, idx) => (
                  <input
                    key={idx}
                    ref={el => { if (el) pinRef.current[idx] = el; }}
                    type={showPin ? "text" : "password"}
                    maxLength={1}
                    value={p}
                    onChange={e => handleChange(pin, setPin, idx, e.target.value, pinRef)}
                    onKeyDown={e => handleKeyDown(pin, setPin, e, idx, pinRef)}
                    className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-gray-600 mb-2">{lang === "TH" ? "ยืนยันรหัส PIN" : "Confirm PIN"}</label>
              <div className="flex justify-between">
                {confirmPin.map((p, idx) => (
                  <input
                    key={idx}
                    ref={el => { if (el) confirmRef.current[idx] = el; }}
                    type={showPin ? "text" : "password"}
                    maxLength={1}
                    value={p}
                    onChange={e => handleChange(confirmPin, setConfirmPin, idx, e.target.value, confirmRef)}
                    onKeyDown={e => handleKeyDown(confirmPin, setConfirmPin, e, idx, confirmRef)}
                    className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center mt-2 gap-2">
              <button type="button" onClick={() => setShowPin(!showPin)} className="flex items-center gap-1 text-gray-700 cursor-pointer">
                {showPin ? <EyeOff /> : <Eye />}
              </button>
              <span className="text-gray-600 font-medium">{lang === "TH" ? "แสดงรหัส PIN" : "Show PIN"}</span>
            </div>

            <button
              type="submit"
              disabled={!isPinComplete}
              className={`w-full py-3 rounded-full text-white transition-colors ${
                isPinComplete ? "bg-red-700 hover:bg-red-600 cursor-pointer" : "bg-gray-300"
              }`}
            >
              {lang === "TH" ? "ดำเนินการต่อ" : "Proceed"}
            </button>
          </form>
        </div>
      </div>

      <div className="h-full overflow-hidden hidden md:block">
        <Image
          src={banner}
          alt="Banner"
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>
    </>
  );
}
