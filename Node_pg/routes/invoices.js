const express = require("express");
const router = new express.Router();
const err = require("../expressError");
const db = require("../db");

// GET /invoices
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM invoices;`);
    res.json({ invoices: results.rows });
  } catch (error) {
    next(new err("Unexpected Server Error", 500));
  }
});

// GET /invoices/[id]
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query(`SELECT * FROM invoices WHERE id=$1;`, [id]);
    res.json({ invoices: results.rows });
  } catch (error) {
    next(new err(`Invoice cannot be found`, 404));
  }
});

// POST /invoices
router.post("/", async (req, res, next) => {
  try {
    const { comp_code, amt, paid, add_date } = req.body;
    const results = await db.query(
      `INSERT INTO invoices (comp_code, amt, paid, add_date) VALUES ($1, $2, $3, $4) RETURNING *`,
      [comp_code, amt, paid, add_date]
    );
    console.log(results);
    res.json({ invoice: results.rows });
  } catch (error) {
    next(new err("Unexpected Server Error", 500));
  }
});

// PUT /invoices/[id]
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { amt, paid, add_date, paid_date } = req.body;
    const results = await db.query(
      `UPDATE invoices SET amt=$1, paid=$2, add_date=$3, paid_date=$4 WHERE id=$5 RETURNING *`,
      [amt, paid, add_date, paid_date, id]
    );
    res.json({ invoice: results.rows });
  } catch (error) {
    next(error);
    // next(new err(`Invoice cannot be found`, 404));
  }
});

// DELETE /invoices/[id]
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query(`DELETE FROM invoices WHERE id=$1`, [id]);
    res.json({ status: "deleted" });
  } catch (error) {
    next(new err(`Invoice cannot be found`, 404));
  }
});

module.exports = router;

// POST
// curl -X POST -H "Content-Type: application/json" \
//     -d '{"comp_code": "apple", "amt": "1152", "paid":true, "add_date":"20210811", "paid":"20210812" }' \
// http://127.0.0.1:3000/invoices/

// PUT
// curl -X PUT -H "Content-Type: application/json" \
//     -d '{ "amt": "152", "paid":true, "add_date":"20210811", "paid_date":"20210812" }' \
// http://127.0.0.1:3000/invoices/5

// DELETE
// curl -X DELETE http://127.0.0.1:3000/invoices/5
