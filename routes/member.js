const express = require("express");
const knex = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all members
router.get("/", auth, async (req, res) => {
  const members = await knex("member").select(
    "mem_id",
    "mem_name",
    "mem_phone",
    "mem_email"
  );
  res.json(members);
});

// Get a single member
router.get("/:id", auth, async (req, res) => {
  const member = await knex("member").where({ mem_id: req.params.id }).first();
  if (!member) return res.status(404).json({ error: "Member not found" });
  res.json(member);
});

// Update member details
router.put("/:id", auth, async (req, res) => {
  await knex("member").where({ mem_id: req.params.id }).update(req.body);
  res.json({ success: "Member updated" });
});

module.exports = router;
