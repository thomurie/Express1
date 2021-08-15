const express = require("express");
const router = new express.Router();
const err = require("../expressError");
const db = require("../db");
const slugify = require("slugify");

// GET /industries
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM industries;`);
    res.json({ industries: results.rows });
  } catch (error) {
    next(new err("Unexpected Server Error", 500));
  }
});

// POST /industries
router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    const code = slugify(name, "_");
    const results = await db.query(
      `INSERT INTO industries VALUES ($1, $2) RETURNING *`,
      [code, name]
    );
    res.json({ industry: results.rows });
  } catch (error) {
    next(new err("Unexpected Server Error", 500));
  }
});

// PUT /industries/[company]
router.put("/:company", async (req, res, next) => {
  try {
    const { company } = req.params;
    const { ind } = req.body;

    const results = await db.query(
      `INSERT INTO ind_comp VALUES ($1, $2) RETURNING *`,
      [ind, company]
    );
    res.json({ industry: results.rows });
  } catch (error) {
    next(error);
    // next(new err(`Company cannot be found`, 404));
  }
});

module.exports = router;

// POST
// curl -X POST -H "Content-Type: application/json" \
//     -d '{"name": "automotive" }' \
// http://127.0.0.1:3000/industries/

// PUT
// curl -X PUT -H "Content-Type: application/json" \
//     -d '{"ind": "automotive" }' \
// http://127.0.0.1:3000/industries/Toyota
