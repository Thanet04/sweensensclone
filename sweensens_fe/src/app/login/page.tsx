'use client'
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { FaMobileAlt } from "react-icons/fa";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import banner from "../image/register-banner.webp";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useLanguage } from "../Lang/Lang";

export default function Login() {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "phone">("phone");
  const [step, setStep] = useState<"phoneInput" | "pin">("phoneInput");
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const pinRef = useRef<HTMLInputElement[]>([]);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [pinTouched, setPinTouched] = useState<boolean[]>([false, false, false, false, false, false]);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { lang } = useLanguage();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // ลบทุกตัวไม่ใช่ตัวเลข
    if (value.length > 10) value = value.slice(0, 10);
  
    // ใส่ -
    if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d+)/, "$1-$2");
    }
  
    setPhoneInput(value);
  };

  // จัดการ PIN
  const handlePinChange = (idx: number, value: string) => {
    const val = value.replace(/\D/g, "");
    if (!val) return;
    const newPin = [...pin];
    newPin[idx] = val[0];
    setPin(newPin);
    if (idx < 5) pinRef.current[idx + 1]?.focus();
  };

  const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) {
      const newPin = [...pin];
      newPin[idx - 1] = "";
      setPin(newPin);
      pinRef.current[idx - 1]?.focus();
    }
  };

  // ส่งเบอร์ไปขั้น PIN
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) {
      Swal.fire({
        icon: "warning",
        title: "เบอร์โทรไม่ถูกต้อง",
        text: "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก",
      });
      return;
    }
    setStep("pin");
  };

  // Login PIN
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pinStr = pin.join("");
    if (pinStr.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "กรอก PIN ไม่ครบ",
        text: "กรุณากรอก PIN ให้ครบ 6 หลัก",
      });
      return;
    }

    const phoneNumber = phoneInput.replace(/-/g, "");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, pin: pinStr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
      }).then(() => {
        router.push(`/`);
      });
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Login ล้มเหลว", text: err.message });
    }
  };

  // Login Email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      Swal.fire({ icon: "warning", title: "กรุณากรอกข้อมูลให้ครบ" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: emailInput, pin: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
     
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
      }).then(() => {
        router.push(`/`);
      });
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Login ล้มเหลว", text: err.message });
    }
  };

  return (
    <>
      <Navbar onCartClick={() => {}} />
      <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100">
        <div className="flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl flex flex-col justify-center">

            {/* PIN step */}
            {method === "phone" && step === "pin" ? (
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <button
                  type="button"
                  className="flex items-center text-gray-600 hover:text-red-600 mb-4 cursor-pointer"
                  onClick={() => setStep("phoneInput")}
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  {lang === "TH" ? "กลับ" : "Back"}
                </button>

                <div className="flex justify-center mb-6">
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                  <circle cx="36" cy="36" r="33.75" fill="#EAECF0"></circle>
                  <g clipPath="url(#clip0)">
                    <path
                      d="M43.7139 31.5H42.4282V28.9286C42.4282 25.3286 39.5996 22.5 35.9996 22.5C32.3996 22.5 29.571 25.3286 29.571 28.9286V31.5H28.2853C26.871 31.5 25.7139 32.6571 25.7139 34.0714V46.9286C25.7139 48.3429 26.871 49.5 28.2853 49.5H43.7139C45.1282 49.5 46.2853 48.3429 46.2853 46.9286V34.0714C46.2853 32.6571 45.1282 31.5 43.7139 31.5ZM35.9996 43.0714C34.5853 43.0714 33.4282 41.9143 33.4282 40.5C33.4282 39.0857 34.5853 37.9286 35.9996 37.9286C37.4139 37.9286 38.571 39.0857 38.571 40.5C38.571 41.9143 37.4139 43.0714 35.9996 43.0714ZM39.9853 31.5H32.0139V28.9286C32.0139 26.7429 33.8139 24.9429 35.9996 24.9429C38.1853 24.9429 39.9853 26.7429 39.9853 28.9286V31.5Z"
                      fill="#667085"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="27" height="27" fill="white" transform="translate(22.5 22.5)"></rect>
                    </clipPath>
                  </defs>
                </svg>
                </div>

                <h1 className="text-xl font-bold text-center mb-8">ใส่รหัส PIN</h1>

                <div className="flex justify-center gap-12 mb-8">
                  {pin.map((p, idx) => (
                    <input
                      key={idx}
                      ref={el => { if(el) pinRef.current[idx] = el; }}
                      type="password"
                      maxLength={1}
                      value={p}
                      onChange={e => { handlePinChange(idx, e.target.value); let arr = [...pinTouched]; arr[idx] = true; setPinTouched(arr); }}
                      onKeyDown={e => handlePinKeyDown(e, idx)}
                      className={`w-6 h-6 text-center text-xl border rounded-full focus:outline-none ${pinTouched[idx] && !p ? 'border-red-500' : 'border'} focus:border-red-500`}
                      required
                      onBlur={() => { let arr = [...pinTouched]; arr[idx] = true; setPinTouched(arr); }}
                    />
                  ))}
                </div>
                {pinTouched.some((t, idx) => t && !pin[idx]) && (
                  <div className="text-red-500 text-xs text-center mt-1">กรุณากรอก PIN ให้ครบทุกช่อง</div>
                )}
                <button type="submit"
                  className={`w-full py-3 rounded-full font-semibold mb-4 transition ${pin.every(p => p) ? 'bg-red-700 text-white' : 'bg-gray-300 text-gray-500'}`}
                  disabled={!pin.every(p => p)}
                >
                  {lang === "TH" ? "ดำเนินการต่อ" : "Proceed"}
                </button>
              </form>
            ) : (
              <>
                <div className="flex items-center my-4 p-1 hover:bg-gray-100 rounded-lg w-20 cursor-pointer">
                  <ChevronLeft  className="w-5 h-5 font-bold"/>
                  <button className="text-lg font-bold cursor-pointer" onClick={() => router.push("/")}>
                  {lang === "TH" ? "กลับ" : "Back"}
                  </button>
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  {lang === "TH" ? " ยินดีต้อนรับสมาชิก Swensen's เข้าสู่ระบบแล้วเริ่มสั่งไอศกรีมกันเลย!" : "Welcome! To continue, please sign in."}
                </h1>

                {method === "phone" && step === "phoneInput" && (
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                      <label className="block text-md font-medium mb-1">
                        {lang === "TH" ? "เบอร์โทรศัพท์" : "Phone number"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className="w-full border rounded-lg px-3 py-2 "
                        placeholder={lang === "TH" ? "กรอกเบอร์โทรศัพท์" : "Enter phone number"}
                        value={phoneInput}
                        onChange={handlePhoneChange}
                        required
                        onBlur={() => setPhoneTouched(true)}
                      />
                      {phoneTouched && !phoneInput && (
                        <div className="text-red-500 text-sm mt-1">{lang === "TH" ? "กรูณากรอกเบอร์โทรศัพท์" : "Plase Enter phone number"}</div>
                      )}
                    </div>
                    <button type="submit"
                      className={`w-full py-3 rounded-full font-semibold mb-4 transition ${phoneInput ? 'bg-red-700 text-white' : 'bg-gray-300 text-gray-500'}`}
                      disabled={!phoneInput}
                    >
                      {lang === "TH" ? "ดำเนินการต่อ" : "Proceed"}
                    </button>
                  </form>
                )}

                {method === "email" && (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {lang === "TH" ? "อีเมล" : "Email"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={`w-full border rounded-lg px-3 py-2 ${emailTouched && !emailInput ? 'border-red-500' : ''}`}
                        placeholder={lang === "TH" ? "กรอกอีเมล" : "Enter Email"}
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        required
                        onBlur={() => setEmailTouched(true)}
                      />
                      {emailTouched && !emailInput && (
                        <div className="text-red-500 text-xs mt-1"> {lang === "TH" ? "กรุณากรอกอีเมล" : "Plase Enter Email"}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {lang === "TH" ? "รหัสผ่าน" : "Password"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        className={`w-full border rounded-lg px-3 py-2 ${passwordTouched && !passwordInput ? 'border-red-500' : ''}`}
                        placeholder={lang === "TH" ? "รหัสผ่าน" : "Password"}
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                        required
                        onBlur={() => setPasswordTouched(true)}
                      />
                      {passwordTouched && !passwordInput && (
                        <div className="text-red-500 text-xs mt-1">{lang === "TH" ? "กรุณากรอกรหัสผ่าน" : "Plase Enter Password"}</div>
                      )}
                    </div>
                    <button type="submit" className={`w-full bg-gray-300 text-gray-500 py-3 rounded-full font-semibold ${emailInput && passwordInput ? 'bg-red-500 text-white' : ''}`} disabled={!(emailInput && passwordInput)}>
                      {lang === "TH" ? "เข้าสู่ระบบ" : "Login"}
                    </button>
                  </form>
                )}
              </>
            )}

            {step !== "pin" && (
              <>
                <div className="flex items-center my-4">
                  <hr className="flex-1 border-gray-300" />
                  <span className="mx-2 text-gray-400 text-sm">{lang === "TH" ? "หรือ" : "OR"}</span>
                  <hr className="flex-1 border-gray-300" />
                </div>

                {method !== "email" && (
                  <button
                    className="w-full flex items-center justify-center text-gray-500 border border-gray-300 rounded-full py-2 hover:bg-gray-100 transition mb-2"
                    onClick={() => { setMethod("email"); setStep("phoneInput"); }}
                  >
                    <MdEmail className="mr-2 text-xl" />
                    {lang === "TH" ? "เข้าสู่ระบบด้วยอีเมล" : "Login by Email"}
                  </button>
                )}

                {method !== "phone" && (
                  <button
                    className="w-full flex items-center justify-center text-gray-500 border border-gray-300 rounded-full py-2 hover:bg-gray-100 transition"
                    onClick={() => { setMethod("phone"); setStep("phoneInput"); }}
                  >
                    <FaMobileAlt className="mr-2 text-xl" />
                    {lang === "TH" ? "เข้าสู่ระบบด้วยโทรศัพท์" : "Phone number"}
                  </button>
                )}

                <div className="text-center mt-4">
                  <span>{lang === "TH" ? "ยังไม่มีบัญชีใช่หรือไม่" : "Don’t have an account ?"}</span>
                  <a href="/Register" className="text-geay-600 hover:underline">
                    {lang === "TH" ? "สร้างบัญชี" : "Sign up"}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="hidden md:block h-full overflow-hidden shadow-lg">
          <Image
            src={banner}
            alt="Banner"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </>
  );
}
