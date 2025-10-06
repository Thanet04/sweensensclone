'use client'
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ChangeLan from '../image/change-language.svg';
import Logo from "../image/logo.svg";
import ModileCart from '../image/mobile-cart.svg';
import Order from '../image/order-rerodering.svg';
import M_Point from "../image/member-point.svg";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
}

export default function Navbar({ onCartClick }: { onCartClick: () => void }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState<"TH" | "EN">("TH");
    const [langOpen, setLangOpen] = useState(false);
    const [langOpenMobile, setLangOpenMobile] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    useEffect(() => {
      // ดึงข้อมูลผู้ใช้จาก localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }, []);

    const changeLang = (value: "TH" | "EN") => {
        setLang(value);
        setLangOpen(false);
        setLangOpenMobile(false);
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setOpen(false);
      router.push("/");
    };

  return (
    <nav className="w-full bg-white shadow px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between md:justify-center">
        <button onClick={() => setOpen(true)} className="md:hidden">
            <Menu className="w-6 h-6" />    
        </button>

        <div className="flex-1 flex justify-center md:justify-start md:pl-4">
          <Image src={Logo} alt="Logo" className="h-8 w-auto" />
        </div>

        <div className="flex md:items-center md:gap-4">
        {user &&(
          <div className="hidden md:flex items-center gap-2">
            <Image src={M_Point} alt="User" className="h-6 w-auto" />
            <span className="font-semibold text-lg text-gray-500">0 แต้ม</span>
          </div>
        )}

            <button className="cursor-pointer" onClick={onCartClick}>
              <Image src={ModileCart} alt="ModileCart" className="h-8 w-auto" />
            </button>
    
            {/* Desktop - แสดงปุ่มหรือข้อมูลผู้ใช้ */}
            {user ? (
              <div className="hidden md:block relative">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-700 rounded-full text-red-700 cursor-pointer hover:bg-red-700 hover:text-white"
                >
                  <span>สวัสดี {user.first_name}</span>
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 py-2">
                    <button 
                      onClick={() => { setUserDropdownOpen(false); router.push('/orders'); }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <Image src={Order} alt="Orders" className="h-5 w-auto" />
                      <span>คำสั่งซื้อและสั่งอีกครั้ง</span>
                    </button>
                    <button 
                      onClick={() => { setUserDropdownOpen(false); router.push('/profile'); }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      <FaUserCircle className="w-5 h-5" />
                      <span>โปรไฟล์</span>
                    </button>
                    <hr className="my-2 mx-4 border-gray-300" />
                    <button  onClick={handleLogout}
                      className="flex justify-center items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 20" fill="none" data-sentry-element="svg" data-sentry-component="LogOut" data-sentry-source-file="LogOut.tsx">
                        <path d="M4.75358 4.16667H9.75358C10.2119 4.16667 10.5869 3.79167 10.5869 3.33333C10.5869 2.875 10.2119 2.5 9.75358 2.5H4.75358C3.83691 2.5 3.08691 3.25 3.08691 4.16667V15.8333C3.08691 16.75 3.83691 17.5 4.75358 17.5H9.75358C10.2119 17.5 10.5869 17.125 10.5869 16.6667C10.5869 16.2083 10.2119 15.8333 9.75358 15.8333H4.75358V4.16667Z" fill="#EB334E" data-sentry-element="path" data-sentry-source-file="LogOut.tsx"></path>
                        <path d="M17.7952 9.70833L15.4702 7.38333C15.2036 7.11667 14.7536 7.3 14.7536 7.675V9.16667H8.92025C8.46191 9.16667 8.08691 9.54167 8.08691 10C8.08691 10.4583 8.46191 10.8333 8.92025 10.8333H14.7536V12.325C14.7536 12.7 15.2036 12.8833 15.4619 12.6167L17.7869 10.2917C17.9536 10.1333 17.9536 9.86667 17.7952 9.70833Z" fill="#EB334E" data-sentry-element="path" data-sentry-source-file="LogOut.tsx"></path>
                      </svg>
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="hidden md:block p-2 bg-red-700 hover:bg-red-600 rounded-full text-white text-xl"
              >
                เข้าสู่ระบบ / ลงทะเบียน
              </button>
            )}

            <div className="hidden md:block relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-3 py-1 cursor-pointer mt-1"
              >
                <Image src={ChangeLan} alt="ChangeLanguage" className="h-4 w-auto" />
                <p className="text-lg">{lang}</p>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow z-50">
                  <button 
                    onClick={() => changeLang("TH")} 
                    className="block w-full text-center px-4 py-2 hover:bg-gray-200"
                  >
                    TH
                  </button>
                  <button 
                    onClick={() => changeLang("EN")} 
                    className="block w-full text-center px-4 py-2 hover:bg-gray-200"
                  >
                    EN
                  </button>
                </div>
              )}
            </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-end p-4">
          <button onClick={() => setOpen(false)} className="self-end">
            <X className="text-red-600 w-6 h-6" />
          </button>
          
          {user ? (
            <div className="w-full flex items-center gap-2 mt-2">
              <p className="text-xl font-semibold">สวัสดี, {user.first_name} 🍦</p>

            </div>
          ) : (
            <p className="text-lg mt-2">Login to begin your ice cream journey</p>
          )}

          {user && (
            <div className="md:hidden w-full gap-2 border-b border-gray-300 py-2 mb-2">
              <div className="flex items-center gap-2">
                <Image src={M_Point} alt="User" className="h-6 w-auto" />
                <span className="font-semibold text-lg text-gray-500">0 แต้ม</span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex flex-col pb-4 px-4 space-y-4">
          <a href="#" className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100">
            <Image src={Order} alt="Orders" className="h-8 w-auto" />
            <p className="text-lg">คำสั่งซื้อและสั่งอีกครั้ง</p>
          </a>
          <a href="#" className="flex items-center gap-2 px-4 text-gray-700 hover:bg-gray-100">
            <FaUserCircle className="w-6 h-6" />
            <p className="text-lg">โปรไฟล์</p>
          </a>
          <div className="flex flex-col ml-8 space-y-2">
            <a href="#" className="flex items-center gap-2 py-2 px-4 text-gray-700 hover:bg-gray-100">
              <p className="text-lg">เปลี่ยน PIN</p>
            </a>
            <a href="#" className="flex items-center gap-2 py-2 px-4 text-gray-700 hover:bg-gray-100">
              <p className="text-lg">บัตรเครดิตของฉัน</p>
            </a>
            <a href="#" className="flex items-center gap-2 py-2 px-4 text-gray-700 hover:bg-gray-100">
              <p className="text-lg">สมุดที่อยู่</p>
            </a>
          </div>

          <div className="relative text-lg">
            <button 
              onClick={() => setLangOpenMobile(!langOpenMobile)}
              className="flex items-center justify-between w-full px-4 py-2"
            >
              ภาษา - {lang}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                langOpenMobile ? "rotate-180" : ""
              }`} />
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${
              langOpenMobile ? "max-h-40 mt-2" : "max-h-0"
            }`}>
              <button 
                onClick={() => changeLang("TH")}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  lang === "TH" ? "border-l-4 border-red-600 font-semibold bg-gray-50" : ""
                }`}
              >
                ภาษาไทย
              </button>
              <button 
                onClick={() => changeLang("EN")}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  lang === "EN" ? "border-l-4 border-red-600 font-semibold bg-gray-50" : ""
                }`}
              >
                ENGLISH
              </button>
            </div>
          </div>

          {user ? (
            <div>
              <hr className="my-2 mx-4 border-gray-300" />
              <button
                onClick={handleLogout}
                className="w-full  flex items-center ml-4 text-lg py-2 text-red-500 rounded-full cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 20" fill="none" data-sentry-element="svg" data-sentry-component="LogOut" data-sentry-source-file="LogOut.tsx">
                        <path d="M4.75358 4.16667H9.75358C10.2119 4.16667 10.5869 3.79167 10.5869 3.33333C10.5869 2.875 10.2119 2.5 9.75358 2.5H4.75358C3.83691 2.5 3.08691 3.25 3.08691 4.16667V15.8333C3.08691 16.75 3.83691 17.5 4.75358 17.5H9.75358C10.2119 17.5 10.5869 17.125 10.5869 16.6667C10.5869 16.2083 10.2119 15.8333 9.75358 15.8333H4.75358V4.16667Z" fill="#EB334E" data-sentry-element="path" data-sentry-source-file="LogOut.tsx"></path>
                        <path d="M17.7952 9.70833L15.4702 7.38333C15.2036 7.11667 14.7536 7.3 14.7536 7.675V9.16667H8.92025C8.46191 9.16667 8.08691 9.54167 8.08691 10C8.08691 10.4583 8.46191 10.8333 8.92025 10.8333H14.7536V12.325C14.7536 12.7 15.2036 12.8833 15.4619 12.6167L17.7869 10.2917C17.9536 10.1333 17.9536 9.86667 17.7952 9.70833Z" fill="#EB334E" data-sentry-element="path" data-sentry-source-file="LogOut.tsx"></path>
                </svg>
                ออกจากระบบ
              </button>
           </div>
          ) : (
            <button onClick={() => router.push('/login')}
              className="w-full py-2 bg-red-700 hover:bg-red-600 rounded-full text-white">
              เข้าสู่ระบบ / ลงทะเบียน
            </button>
          )}
        </nav>
      </div>
    </nav>
  );
}