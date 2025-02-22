const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knex = require("../config/db");

const router = express.Router();

// Register a member
router.post("/register", async (req, res) => {
  const { mem_name, mem_phone, mem_email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [user] = await knex("member").insert(
      { mem_name, mem_phone, mem_email, password: hashedPassword },
      ["mem_id", "mem_email"]
    );
    const token = jwt.sign(
      { id: user.mem_id, email: user.mem_email },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login a member
router.post("/login", async (req, res) => {
  const { mem_email, password } = req.body;
  const user = await knex("member").where({ mem_email }).first();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.mem_id, email: user.mem_email },
    process.env.JWT_SECRET,
    { expiresIn: "5h" }
  );
  res.json({ token });
});

module.exports = router;
