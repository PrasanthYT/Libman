const express = require("express");
const knex = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all issued books
router.get("/", auth, async (req, res) => {
  const issuance = await knex("issuance")
    .join("book", "issuance.book_id", "=", "book.book_id")
    .join("member", "issuance.issuance_member", "=", "member.mem_id")
    .select("issuance.*", "book.book_name", "member.mem_name");
  res.json(issuance);
});

// Pending book returns
router.get("/pending", auth, async (req, res) => {
  try {
    const pendingReturns = await knex("issuance")
      .join("book", "issuance.book_id", "=", "book.book_id")
      .join("member", "issuance.issuance_member", "=", "member.mem_id")
      .where("issuance.issuance_status", "=", "Issued")
      .select(
        "issuance.issuance_id",
        "member.mem_name as member_name",
        "book.book_name",
        "issuance.issuance_date",
        "issuance.target_return_date",
        "book.book_publisher as author"
      )
      .orderBy("issuance.target_return_date", "asc");

    res.json(pendingReturns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending returns" });
  }
});

// Issue a book
router.post("/", auth, async (req, res) => {
  const { book_id, issuance_member, issued_by, target_return_date } = req.body;
  const [issue] = await knex("issuance").insert(
    {
      book_id,
      issuance_member,
      issued_by,
      target_return_date,
      issuance_status: "Issued",
    },
    ["issuance_id"]
  );
  res.json(issue);
});

// Update issuance status
router.put("/:id", auth, async (req, res) => {
  await knex("issuance").where({ issuance_id: req.params.id }).update(req.body);
  res.json({ success: "Issuance updated" });
});

module.exports = router;
