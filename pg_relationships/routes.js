const db = require("./db");
const express = require("express");
const ExpressError = require("./expressError");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM users`);
    return res.json(results.rows);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const userResults = await db.query(
      `SELECT name, type FROM users WHERE id=$1`,
      [id]
    );
    const msgResults = await db.query(
      `SELECT id, msg FROM messages WHERE user_id = $1`,
      [id]
    );
    const user = userResults.rows[0];
    user.messages = msgResults.rows;
    return res.send(user);
  } catch (error) {
    return next(error);
  }
});

router.get("/messages/:id", async (req, res, next) => {
  try {
    const results = await db.query(
      `
    SELECT m.id, m.msg, t.tag
    FROM messages as m
    LEFT JOIN messages_tags as mt
    ON m.id = mt.message_id
    LEFT JOIN tags AS t
    ON mt.tag_code = t.code
    WHERE id=$1`,
      [req.params.id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError("message not found with id", 404);
    }
    const { id, msg } = results.rows[0];
    const tags = results.rows.map((r) => r.tag);
    res.json({ id: id, msg: msg, tags: tags });
  } catch (error) {}
});

module.exports = router;
