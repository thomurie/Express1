const express = require("express");
const Book = require("../models/book");
const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");
const exprserr = require("../expressError");

const router = new express.Router();

/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, bookSchema);
    if (!result.valid) {
      let errorLst = result.errors.map((e) => e.stack);
      let error = new exprserr(errorLst, 400);
      return next(error);
    }
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, bookSchema);
    if (!result.valid) {
      let errorLst = result.errors.map((e) => e.stack);
      let error = new exprserr(errorLst, 400);
      return next(error);
    }
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

// POST
// curl -X POST -H "Content-Type: application/json" \
//      -d '{ "isbn": "0691161510", "amazon_url": "http://a.co/eobPtX2", "author": "Matthew Lane", "language": "english", "pages": 264, "publisher": "Princeton University Press", "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games", "year": 2017 }' \
// http://127.0.0.1:3000/books/

// PUT
// curl -X PUT -H "Content-Type: application/json" \
//     -d '{ "isbn": "0691161510", "amazon_url": "http://a.co/eobPtX2", "author": "Matthew S. Lane", "language": "english", "pages": 260, "publisher": "Princeton University Press", "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games", "year": 2019 }' \
// http://127.0.0.1:3000/books/0691161510

// BAD POST
// curl -X POST -H "Content-Type: application/json" \
//      -d '{ "isbn": "06911615101", "amazon_url": "http://a.co/eobPtX2", "author": 12, "language": "english", "pages": 264, "publisher": "Princeton University Press", "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games", "year": "2017" }' \
// http://127.0.0.1:3000/books/

// BAD PUT
// curl -X PUT -H "Content-Type: application/json" \
//     -d '{ "isbn": "06911615101", "amazon_url": "http://a.co/eobPtX2", "author": 12, "language": "english", "pages": 264, "publisher": "Princeton University Press", "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games", "year": "2017" }' \
// http://127.0.0.1:3000/books/0691161510
