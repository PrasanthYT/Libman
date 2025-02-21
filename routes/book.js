const express = require("express");
const knex = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all books
router.get("/", auth, async (req, res) => {
  const books = await knex("book").select("*");
  res.json(books);
});

// Get a single book by ID
router.get("/:id", auth, async (req, res) => {
  const book = await knex("book").where({ book_id: req.params.id }).first();
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Add a new book
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

// Update a book
router.put("/:id", auth, async (req, res) => {
  await knex("book").where({ book_id: req.params.id }).update(req.body);
  res.json({ success: "Book updated" });
});

module.exports = router;
