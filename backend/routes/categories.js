import express from "express";
import DB from "../config/db.js";

const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const [rows] = await DB.query("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await DB.query("SELECT * FROM categories WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add category
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await DB.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description]
    );
    res.json({ message: "Category added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const [result] = await DB.query(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await DB.query("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
