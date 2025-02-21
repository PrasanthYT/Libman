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

// Issue a book to a member
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

// Update issuance status (e.g., returned)
router.put("/:id", auth, async (req, res) => {
  await knex("issuance").where({ issuance_id: req.params.id }).update(req.body);
  res.json({ success: "Issuance updated" });
});

module.exports = router;
