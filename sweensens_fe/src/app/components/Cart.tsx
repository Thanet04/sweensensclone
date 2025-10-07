'use client'
import { X } from "lucide-react";
import { useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { useLanguage } from "../Lang/Lang";

interface CartProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Cart({ isOpen, setIsOpen }: CartProps) {
  const { lang } = useLanguage();

  return (
    <>
      <div 
        className="fixed hidden md:flex flex-col items-center justify-center right-0 top-1/2 -translate-y-1/2 z-30 gap-2 bg-red-600 text-white px-4 py-6 rounded-l-lg shadow-lg cursor-pointer hover:bg-red-500 hover:px-6 transition"
        onClick={() => setIsOpen(true)}
      >
        <FaShoppingBag className="w-6 h-6 text-white" />
        <span className="text-center font-semibold">{lang === "TH" ? "ตระกร้า" : "My Cart"}</span>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div
          className={`
            fixed w-full h-120 md:w-80 md:h-120 bg-white shadow-xl z-50 p-4 flex flex-col transform transition-transform duration-300
            md:top-1/2 md:-translate-y-1/2 md:right-0 rounded-t-xl md:rounded-t-none md:rounded-l-lg
            bottom-0 md:bottom-auto
            ${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full"}
          `}
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="hidden md:block absolute -left-3 top-0 md:-left-3 md:top-0 bg-gray-700 rounded-full p-1 shadow cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex flex-col justify-center items-center h-full"> 
              <MdAddShoppingCart className="w-15 h-15 text-gray-400" /> 
              <p className="text-md text-gray-400">{lang === "TH" ? "เริ่มเพิ่มสินค้าในรถเข็นของคุณ" : "Start adding items to your cart"}</p> 
          </div>
        </div>
      )}
    </>
  );
}
