'use client'

import { X } from "lucide-react";
import { CiMap } from "react-icons/ci";
import Image from "next/image";
import Location from '../image/empty-address-list.webp'

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Popup({ isOpen, onClose }: PopupProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-lg w-4/5 md:max-w-xl h-1/2 md:h-2/3  p-6 overflow-y-auto">
    <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 cursor-pointer"
    >
        <X className="w-6 h-6 text-gray-700" />
    </button>
    
    <h1 className="text-xl font-bold my-2">เลือกที่อยู่สำหรับจัดส่ง</h1>

    <div className="w-full flex flex-col-reverse md:flex-row md:items-center justify-between my-2">
        <h1 className="text-lg md:text-xl font-semibold text-gray-600">ที่อยู่ที่บันทึกไว้</h1>

        <div className="flex items-center justify-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
            <CiMap className="h-5 w-5 text-blue-700"/>
            <p className="text-xl text-blue-700 font-semibolds">เลือกจากแผนที่</p>
        </div>
    </div>
    
    <div className="flex flex-col items-center my-8">
        <Image src={Location} alt="Location" />
        <h1 className="text-xl font-semibold text-gray-600 my-2">ไม่มีที่อยู่ที่บันทึกไว้</h1>
    </div>

    </div>
    </>
  );
}
