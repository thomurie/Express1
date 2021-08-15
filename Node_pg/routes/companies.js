const express = require("express");
const router = new express.Router();
const err = require("../expressError");
const db = require("../db");
const slugify = require("slugify");

// GET /companies
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM companies;`);
    const wanted_data = [];
    results.rows.forEach((row) => {
      const { code, name } = row;
      wanted_data.push({ code, name });
    });
    res.json({ companies: wanted_data });
  } catch (error) {
    next(new err("Unexpected Server Error", 500));
  }
});

// GET /companies/[code]
router.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const results = await db.query(`SELECT * FROM companies WHERE code=$1;`, [
      code,
    ]);

    const invoices = await db.query(
      `SELECT * FROM invoices WHERE comp_code=$1;`,
      [code]
    );

    const industries = await db.query(
      `SELECT i.industry
      FROM industries AS i
      LEFT JOIN ind_comp AS ic
      ON i.code = ic.ind
      LEFT JOIN companies AS c
      ON ic.comp = c.code
      WHERE c.code=$1`,
      [code]
    );
    res.json({
      company: results.rows,
      industries: industries.rows,
      invoices: invoices.rows,
    });
  } catch (error) {
    next(new err(`Company cannot be found`, 404));
  }
});

// POST /companies
router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const code = slugify(name, "_");
    const results = await db.query(
      `INSERT INTO companies VALUES ($1, $2, $3) RETURNING *`,
      [code, name, description]
    );
    res.json({ company: results.rows });
  } catch (error) {
    next(new err("Unexpected Server Error", 500));
  }
});

// PUT /companies/[code]
router.put("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description } = req.body;
    const results = await db.query(
      `UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *`,
      [name, description, code]
    );
    res.json({ company: results.rows });
  } catch (error) {
    next(new err(`Company cannot be found`, 404));
  }
});

// DELETE /companies/[code]
router.delete("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const results = await db.query(
      `DELETE FROM companies WHERE code=$1 RETURNING *`,
      [code]
    );
    res.json({ status: "deleted" });
  } catch (error) {
    next(new err(`Company cannot be found`, 404));
  }
});

module.exports = router;

// POST
// curl -X POST -H "Content-Type: application/json" \
//     -d '{"name": "Toyota", "description": "Japanese Automotive Manufacturer" }' \
// http://127.0.0.1:3000/companies/

// PUT
// curl -X PUT -H "Content-Type: application/json" \
//     -d '{"name": "Logi-Tech", "description": "Maker of mice" }' \
// http://127.0.0.1:3000/companies/logi

// DELETE
// curl -X DELETE http://127.0.0.1:3000/companies/logi
