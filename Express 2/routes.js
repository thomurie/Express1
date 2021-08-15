const express = require("express");
const router = new express.Router();
const err = require("./error");

const items = require("./fakeDb");

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
