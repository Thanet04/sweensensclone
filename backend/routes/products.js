import express from "express";
import DB from "../config/db.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ใช้ multer สำหรับ upload file
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Sweensensclone",
    });

    fs.unlinkSync(file.path);

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/category", async (req, res) => {
  try {
    const [rows] = await DB.query("SELECT id, name, description FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await DB.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { category_id, name, description, price, image_url } = req.body;
    
    const [result] = await DB.query(
      "INSERT INTO products (category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)",
      [category_id, name, description, price, image_url]
    );
    
    res.json({ 
      message: "Product added successfully",
      id: result.insertId 
    });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await DB.query("SELECT * FROM products WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, price, image_url } = req.body;
    
    await DB.query(
      "UPDATE products SET category_id=?, name=?, description=?, price=?, image_url=? WHERE id=?",
      [category_id, name, description, price, image_url, id]
    );
    
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await DB.query("SELECT image_url FROM products WHERE id=?", [id]);
    
    await DB.query("DELETE FROM products WHERE id=?", [id]);
    
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;