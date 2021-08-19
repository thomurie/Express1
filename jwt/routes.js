const express = require("express");
const router = new express.Router();
const err = require("./error");
const bcrypt = require("bcrypt");
const db = require("./db");
const jwt = require("jsonwebtoken");
const { ensureLoggedIn } = require("./middleware");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("./config");

async function createPwd(plainTxt, workFactor = 12) {
  return await bcrypt.hash(plainTxt, workFactor);
}

async function checkPwd(pwd, hshedPwd) {
  return await bcrypt.compare(pwd, hshedPwd);
}

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new err("username and password required", 400);
    }
    const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const results = await db.query(
      `INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING username`,
      [username, hashedPwd]
    );
    return res.json(results.rows);
  } catch (error) {}
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new err("username and password required", 400);
    }
    const results = await db.query(
      `SELECT username, password
      FROM users
      WHERE username=$1`,
      [username]
    );
    const user = results.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ message: "logged on", token: token });
      }
    }
    throw new err("Username not found!", 400);
  } catch (error) {
    return next(error);
  }
});

router.gtt("/private", ensureLoggedIn, (req, res, next) => {
  try {
    const token = req.body._token;
    jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return next(error);
  }
});
// 1.
router.get("/", (req, res, next) => {
  try {
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// 2.
router.post("/", (req, res, next) => {
  try {
    let newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    res.json({ added: newItem });
  } catch (error) {
    next(error);
  }
});

// 3.
router.get("/:name", (req, res) => {
  try {
    let wanted = items.find((v) => v.name === req.params.name);
    if (wanted === undefined) {
      throw new err("Item not found");
    }
    res.json(wanted);
  } catch (error) {
    next(error);
  }
});

// 4.
router.patch("/:name", (req, res) => {
  try {
    const wanted = items.find((v) => v.name === req.params.name);
    if (wanted === undefined) {
      throw new err("Item not found");
    }
    let wantedUpdated = items.find((v) => v.name === req.params.name);
    wantedUpdated.name = req.body.name || req.params.name;
    wantedUpdated.price = req.body.price || wanted.price;
    res.json({
      original: wanted,
      update: wantedUpdated,
    });
  } catch (error) {
    next(error);
  }
});

// 5.
router.delete("/:name", (req, res) => {
  try {
    const wanted = items.find((v) => v.name === req.params.name);
    if (wanted === undefined) {
      throw new err("Item not found");
    }
    items.splice(items.indexOf(wanted), 1);
    res.json({ message: `Deleted` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// POST
// curl -X POST -H "Content-Type: application/json" \
//     -d '{"name": "tea", "price": "2.45" }' \
// http://127.0.0.1:3000/items/

// PATCH
// curl -X PATCH -H "Content-Type: application/json" \
//     -d '{"price": "12.45" }' \
// http://127.0.0.1:3000/items/coffee

// DELETE
// curl -X DELETE http://127.0.0.1:3000/items/coffee
