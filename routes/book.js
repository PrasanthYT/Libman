const express = require("express");
const knex = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

// Get unborrowed books
router.get("/unborrowed", auth, async (req, res) => {
  const books = await knex("book")
    .leftJoin("issuance", "book.book_id", "issuance.book_id")
    .whereNull("issuance.book_id")
    .select("book.book_name", "book.book_publisher");

  res.json(books);
});

// Get top borrowed books
router.get("/top-borrowed", auth, async (req, res) => {
  const books = await knex("issuance")
    .join("book", "issuance.book_id", "book.book_id")
    .groupBy("book.book_id", "book.book_name")
    .select(
      "book.book_name",
      knex.raw("COUNT(issuance.issuance_id) AS times_borrowed"),
      knex.raw("COUNT(DISTINCT issuance.issuance_member) AS unique_members")
    )
    .orderBy("times_borrowed", "desc")
    .limit(10);

  res.json(books);
});

// Get all books
router.get("/:id", auth, async (req, res) => {
  const book = await knex("book").where({ book_id: req.params.id }).first();
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Post a book
router.post("/", auth, async (req, res) => {
  const {
    book_name,
    book_cat_id,
    book_collection_id,
    book_launch_date,
    book_publisher,
  } = req.body;
  const [book] = await knex("book").insert(
    {
      book_name,
      book_cat_id,
      book_collection_id,
      book_launch_date,
      book_publisher,
    },
    ["book_id"]
  );
  res.json(book);
});

// Update book details
router.put("/:id", auth, async (req, res) => {
  await knex("book").where({ book_id: req.params.id }).update(req.body);
  res.json({ success: "Book updated" });
});

module.exports = router;
