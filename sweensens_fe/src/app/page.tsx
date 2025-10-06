'use client'
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Card from "./components/Card"
import BannerSwiper from "./components/Banner";
import { CiLocationOn } from "react-icons/ci";
import promo from "./image/banner2Fsw-banner.webp";
import Cart from "./components/Cart";
import Popup from "./components/popup";

// Mock data สำรอง
const mock_categories = [
  { id: 96, name: "ไอศกรีม", description: "ไอศกรีมหลากหลายรสชาติ" },
  { id: 97, name: "เครื่องดื่ม", description: "เครื่องดื่มสดชื่น" },
  { id: 98, name: "ของทานเล่น", description: "ของทานเล่นอร่อย" },
];

const mock_products = [
  { 
    id: 101, 
    image_url: promo, 
    price: 369, 
    name: "ซื้อ 1 แถม 1 ไอศกรีม ควอท ราคาพิเศษ 369 บาท", 
    description: "ไอศกรีมควอททุกสาขา!", 
    category_id: 'mock-1',
  },
  { 
    id: 102, 
    image_url: promo, 
    price: 399, 
    name: "2 ควอท Mini Quart 399 บาท", 
    description: "น้ำหนักสุทธิ 250 กรัมต่อ 1 ควอท", 
    category_id: 'mock-1',
  },
  { 
    id: 103, 
    image_url: promo, 
    price: 299, 
    name: "น้ำผลไม้ปั่นสด 299 บาท", 
    description: "สดชื่นทุกแก้ว", 
    category_id: 'mock-2',
  },
  { 
    id: 104, 
    image_url: promo, 
    price: 199, 
    name: "เฟรนช์ฟรายส์กรอบ", 
    description: "ของทานเล่นสุดฮิต", 
    category_id: 'mock-3',
  },
];

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // States สำหรับ API data
  const [categories, setCategories] = useState(mock_categories);
  const [products, setProducts] = useState(mock_products);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // โปรโมชัน (ใช้ mock data อยู่)
  const promotions = [
    { image: promo, price: 369, title: "ซื้อ 1 แถม 1 ไอศกรีม ควอท ราคาพิเศษ 369 บาท", description: "ไอศกรีมควอททุกสาขา!", category: "ไอศกรีม" },
    { image: promo, price: 399, title: "2 ควอท Mini Quart 399 บาท", description: "น้ำหนักสุทธิ 250 กรัมต่อ 1 ควอท", category: "ไอศกรีม" },
    { image: promo, price: 299, title: "น้ำผลไม้ปั่นสด 299 บาท", description: "สดชื่นทุกแก้ว", category: "เครื่องดื่ม" },
    { image: promo, price: 199, title: "เฟรนช์ฟรายส์กรอบ", description: "ของทานเล่นสุดฮิต", category: "ของทานเล่น" },
  ];

  // Fetch data จาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let fetchedCategories = [];
        let fetchedProducts = [];

        // Fetch categories
        try {
          const categoriesRes = await fetch('http://localhost:5000/api/categories');
          if (categoriesRes.ok) {
            const categoriesData = await categoriesRes.json();
            if (categoriesData && categoriesData.length > 0) {
              fetchedCategories = categoriesData;
            }
          }
        } catch (err) {
          console.warn('ไม่สามารถดึงข้อมูล categories จาก API:', err);
        }

        // Fetch products
        try {
          const productsRes = await fetch('http://localhost:5000/api/products');
          if (productsRes.ok) {
            const productsData = await productsRes.json();
            if (productsData && productsData.length > 0) {
              // แปลง image_url ถ้าเป็น null ให้ใช้รูปภาพ default
              fetchedProducts = productsData.map((p: { image_url: any; price: string; }) => ({
                ...p,
                image_url: p.image_url || promo,
                price: parseFloat(p.price) // แปลง string เป็น number
              }));
            }
          }
        } catch (err) {
          console.warn('ไม่สามารถดึงข้อมูล products จาก API:', err);
        }

        // รวมข้อมูล API + Mock data
        const allCategories = [...fetchedCategories, ...mock_categories];
        const allProducts = [...fetchedProducts, ...mock_products];

        setCategories(allCategories);
        setProducts(allProducts);
        
        // เลือก category แรก
        if (allCategories.length > 0) {
          setSelectedCategory(allCategories[0].id);
        }

      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
        // ถ้า error ใช้ mock data เท่านั้น
        setCategories(mock_categories);
        setProducts(mock_products);
        setSelectedCategory(mock_categories[0].id);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products ตาม category ที่เลือก
  const filteredProducts = products.filter(
    (product) => product.category_id === selectedCategory
  );

  return (
    <div className="w-full flex flex-col items-center ">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 p-4 w-full max-w-6xl">
        <h1 className="text-xl font-bold whitespace-nowrap">ไปส่งที่ :</h1>
        <div className="relative w-full">
          <CiLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            className="w-full border border-gray-300 bg-gray-200 rounded-md px-10 py-2 text-black"
            placeholder="เลือกที่อยู่สำหรับจัดส่ง"
            onFocus={() => setIsOpen(true)}
            readOnly
          />
        </div>
        <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}></Popup>
      </div>

      <div className="w-full max-w-6xl px-4">
        <BannerSwiper />
      </div>

      {/* โปรโมชัน */}
      <div className="w-full max-w-6xl px-4 mt-8">
        <h1 className="text-2xl font-bold mb-6">โปรโมชัน</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {promotions.map((promo, idx) => (
            <Card key={idx} promo={promo} />
          ))}
        </div>
      </div>

      {/* เมนูจัดส่ง */}
      <div className="w-full max-w-6xl px-4 mt-8 mb-8">
        <h1 className="text-2xl font-bold mb-6">เมนูจัดส่ง</h1>

        {/* แสดง error message ถ้ามี */}
        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p className="font-medium">แสดงข้อมูลทั้งจาก API และข้อมูลสำรอง</p>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Categories tabs */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedCategory === cat.id
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    promo={{
                      image: product.image_url,
                      price: product.price,
                      title: product.name,
                      description: product.description
                    }} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  ไม่มีสินค้าในหมวดหมู่นี้
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <Cart isOpen={cartOpen} setIsOpen={setCartOpen}/>
    </div>
  );
}