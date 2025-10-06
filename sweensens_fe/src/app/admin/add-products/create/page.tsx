"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../../../components/adminlayout";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Product {
  id?: number;
  name: string;
  price: number;
  category_id: number;
  description?: string;
  image_url?: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) setCategory(data[0].id.toString());
      } catch (err) {
        console.error("โหลดหมวดหมู่ผิดพลาด:", err);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถโหลดหมวดหมู่ได้",
        });
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (idParam) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${idParam}`);
          if (!res.ok) throw new Error("ไม่พบสินค้า");
          const data: Product = await res.json();
          setName(data.name);
          setPrice(data.price.toString());
          setCategory(data.category_id.toString());
          setDescription(data.description || "");
          if (data.image_url) setPreview(data.image_url);
        } catch (err) {
          console.error("โหลดสินค้าล้มเหลว:", err);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถโหลดข้อมูลสินค้าได้",
          });
        }
      };
      fetchProduct();
    }
  }, [idParam]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = preview || "";

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadRes = await fetch("http://localhost:5000/api/products/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const product: Product = {
        name,
        price: Number(price),
        category_id: Number(category),
        description,
        image_url: imageUrl,
      };

      const res = await fetch(
        idParam
          ? `http://localhost:5000/api/products/${idParam}`
          : "http://localhost:5000/api/products",
        {
          method: idParam ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );

      if (!res.ok) throw new Error(idParam ? "แก้ไขสินค้าไม่สำเร็จ" : "เพิ่มสินค้าไม่สำเร็จ");

      await Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: idParam ? "แก้ไขสินค้าเรียบร้อยแล้ว" : "เพิ่มสินค้าเรียบร้อยแล้ว",
        confirmButtonText: "OK",
        confirmButtonColor: "#b91c1c",
      });

      router.push("/admin/add-products");

    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: idParam ? "ไม่สามารถแก้ไขสินค้าได้" : "ไม่สามารถเพิ่มสินค้าได้",
        confirmButtonText: "ลองอีกครั้ง",
        confirmButtonColor: "#b91c1c",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          {idParam ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-4 sm:space-y-6"
        >
          <div>
            <label className="block font-semibold mb-2 text-sm sm:text-base">รูปภาพสินค้า</label>

            <div className="relative w-full h-48 sm:h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              {preview ? (
                <Image src={preview} alt="preview" fill className="object-cover" />
              ) : (
                <p className="text-gray-400 text-sm sm:text-base">ยังไม่มีรูปภาพ</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <label
                htmlFor="fileInput"
                className="px-4 py-2 bg-red-700 text-white rounded-full font-semibold cursor-pointer hover:bg-red-600 text-center text-sm sm:text-base"
              >
                เลือกรูปภาพ
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {preview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 text-sm sm:text-base"
                >
                  ลบรูปภาพ
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm sm:text-base">ชื่อสินค้า</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm sm:text-base">ราคา (฿)</label>
            <input
              type="number"
              className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm sm:text-base">หมวดหมู่</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm sm:text-base">รายละเอียด</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm sm:text-base"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-600 text-white py-2 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "กำลังบันทึก..." : idParam ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}