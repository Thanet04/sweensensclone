import express from "express";
import jwt from "jsonwebtoken";
import DB from "../config/db.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    const { first_name, last_name, phone, email, birthday, gender } = req.body;
  
    try {
      const [rows] = await DB.query("SELECT * FROM users WHERE phone=?", [phone]);
      if (rows.length > 0) return res.status(400).json({ error: "phone already exists" });
  
      await DB.query(
        "INSERT INTO users (first_name, last_name, email, phone, birthday, gender) VALUES (?, ?, ?, ?, ?, ?)",
        [first_name, last_name, email, phone, birthday, gender]
      );
  
      res.json({ message: "User registered" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.post("/set-pin", async (req, res) => {
    const { phone, pin } = req.body;
  
    if (!pin || pin.length !== 6) {
      return res.status(400).json({ error: "PIN ต้องมี 6 หลัก" });
    }
  
    try {
      const [rows] = await DB.query("SELECT * FROM users WHERE phone=?", [phone]);
      if (rows.length === 0) return res.status(400).json({ error: "User not found" });
  
      await DB.query("UPDATE users SET password=? WHERE phone=?", [pin, phone]);
  
      res.json({ message: "PIN set successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  
// Login
router.post("/login", async (req, res) => {
  const { phone, email, pin } = req.body;

  try {
    const [rows] = await DB.query(
      "SELECT * FROM users WHERE (phone=? OR email=?) AND password=?",
      [phone, email, pin]
    );

    if (rows.length === 0) return res.status(400).json({ error: "Invalid phone or PIN" });

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email },
      "secret123",
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
