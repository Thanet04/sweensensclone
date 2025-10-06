"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

export default function Card({ promo }: { promo: any }) {
  const [qty, setQty] = useState(1);

  return (
    <div className="relative rounded-xl overflow-hidden bg-white border border-gray-200 group flex flex-col h-full">
      <div className="w-full h-40 relative">
        <Image
          src={promo.image}
          alt={promo.title}
          className="object-cover rounded-t-xl"
          fill
        />

        <button className="absolute bottom-0 translate-y-1/2 right-2 bg-red-600 text-white p-2 rounded-full shadow-md md:hidden" >
          <Plus size={20} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="text-red-600 text-lg font-bold mb-1">฿ {promo.price}</div>
        <div className="font-semibold mb-2 line-clamp-2">{promo.title}</div>
        <div className="text-gray-500 text-sm mb-4 flex-1">{promo.description}</div>
      </div>

      <div className="hidden md:block">
        {promo.isCustomizable ? (
          <button
            className="absolute left-1/2 -translate-x-1/2 bottom-[-56px] w-[90%] 
                       bg-red-700 hover:bg-red-600 text-white py-2 rounded-full 
                       font-semibold text-lg transition-all duration-300 
                       group-hover:bottom-4 z-10 cursor-pointer"
          >
            ดูรายละเอียด
          </button>
        ) : (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-56px]
              w-[90%] flex items-center border border-red-700 
              rounded-full overflow-hidden bg-white
              transition-all duration-300 group-hover:bottom-4 z-10
              hidden md:flex">
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="px-3 py-2 text-sm text-red-700 bg-white focus:outline-none cursor-pointer"
            >
              {[...Array(4)].map((_, i) => (
                <option className="border border-red-700 text-red-700" key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <button className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2 px-4 font-semibold text-sm rounded-r-full cursor-pointer">
              ใส่ตะกร้า ฿{promo.price * qty}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
