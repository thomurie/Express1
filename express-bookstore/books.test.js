process.env.NODE_ENV = "test";

const { TestWatcher } = require("jest");
const request = require("supertest");
const app = require("./app");
const db = require("./db");

beforeAll(async () => {
  await db.query(`DELETE FROM books`);
  await db.query(
    `INSERT INTO books
      (isbn, amazon_url, author, language, pages, publisher, title, year)
      VALUES
      ('0691161510', 'http://a.co/eobPtX0', 'Albert Allen', 'english', 34, 'Alphabet Press', 'Test Book 1', 2010 ),
      ('0691161511', 'http://a.co/eobPtX1', 'Benny Blanco', 'english', 134, 'Big Ben Press', 'Test Book 2', 2011 )`
  );
});

/** GET / => {books: [book, ...]}  */
describe("GET /books", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get("/books/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Are All books shown?", async () => {
    const res = await request(app)
      .get("/books/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.books).toEqual(
      expect.arrayContaining([
        {
          isbn: "0691161510",
          amazon_url: "http://a.co/eobPtX0",
          author: "Albert Allen",
          language: "english",
          pages: 34,
          publisher: "Alphabet Press",
          title: "Test Book 1",
          year: 2010,
        },
        {
          isbn: "0691161511",
          amazon_url: "http://a.co/eobPtX1",
          author: "Benny Blanco",
          language: "english",
          pages: 134,
          publisher: "Big Ben Press",
          title: "Test Book 2",
          year: 2011,
        },
      ])
    );
  });
  test("Invalid get request", async () => {
    const res = await request(app)
      .get("/books/Test_Book")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404);
  });
});

/** GET /[id]  => {book: book} */
describe("GET /books/:id", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get("/books/0691161510")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Are all book details for 0691161510 shown?", async () => {
    const res = await request(app)
      .get("/books/0691161510")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual({
      book: {
        isbn: "0691161510",
        amazon_url: "http://a.co/eobPtX0",
        author: "Albert Allen",
        language: "english",
        pages: 34,
        publisher: "Alphabet Press",
        title: "Test Book 1",
        year: 2010,
      },
    });
  });
  test("Are all book details for 0691161511 shown?", async () => {
    const res = await request(app)
      .get("/books/0691161511")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual({
      book: {
        isbn: "0691161511",
        amazon_url: "http://a.co/eobPtX1",
        author: "Benny Blanco",
        language: "english",
        pages: 134,
        publisher: "Big Ben Press",
        title: "Test Book 2",
        year: 2011,
      },
    });
  });
});

// /** POST /   bookData => {book: newBook}  */
describe("POST /books", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .post("/books")
      .send({
        isbn: "0691161512",
        amazon_url: "http://a.co/eobPtX2",
        author: "Charlie C.",
        language: "english",
        pages: 234,
        publisher: "Candy Cane Press",
        title: "Test Book 3",
        year: 2012,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);
    console.log(res.body);
    expect(res.body).toEqual({
      book: {
        isbn: "0691161512",
        amazon_url: "http://a.co/eobPtX2",
        author: "Charlie C.",
        language: "english",
        pages: 234,
        publisher: "Candy Cane Press",
        title: "Test Book 3",
        year: 2012,
      },
    });
  });
  test("Is book 0691161513 created?", async () => {
    const res = await request(app)
      .post("/books")
      .send({
        isbn: "0691161513",
        amazon_url: "http://a.co/eobPtX3",
        author: "Daniel Denny",
        language: "english",
        pages: 334,
        publisher: "Desert Dunes Press",
        title: "Test Book 4",
        year: 2013,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);
    expect(res.body).toEqual({
      book: {
        isbn: "0691161513",
        amazon_url: "http://a.co/eobPtX3",
        author: "Daniel Denny",
        language: "english",
        pages: 334,
        publisher: "Desert Dunes Press",
        title: "Test Book 4",
        year: 2013,
      },
    });
  });
  test("Is json meeting the schema?", async () => {
    const res = await request(app)
      .post("/books")
      .send({
        isbn: "069116151421",
        amazon_url: "http://a.co/eobPtX0",
        author: 13,
        language: ["english", "spanish", "finnish"],
        pages: "2234",
        publisher: "Candy Cane Press",
        title: null,
        year: "2010",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400);
    expect(res.body).toEqual({
      error: {
        message: [
          "instance.isbn does not meet maximum length of 10",
          "instance.author is not of a type(s) string",
          "instance.language is not of a type(s) string",
          "instance.pages is not of a type(s) integer",
          "instance.title is not of a type(s) string",
          "instance.year is not of a type(s) integer",
        ],
        status: 400,
      },
      message: [
        "instance.isbn does not meet maximum length of 10",
        "instance.author is not of a type(s) string",
        "instance.language is not of a type(s) string",
        "instance.pages is not of a type(s) integer",
        "instance.title is not of a type(s) string",
        "instance.year is not of a type(s) integer",
      ],
    });
  });
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */
describe("PUT /books/:code", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .put("/books/0691161512")
      .send({
        isbn: "0691161512",
        amazon_url: "http://a.co/eobPtX2",
        author: "Charlie Chplin",
        language: "english",
        pages: 224,
        publisher: "Candy Cane Press",
        title: "Test Book 3",
        year: 2021,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual({
      book: {
        isbn: "0691161512",
        amazon_url: "http://a.co/eobPtX2",
        author: "Charlie Chplin",
        language: "english",
        pages: 224,
        publisher: "Candy Cane Press",
        title: "Test Book 3",
        year: 2021,
      },
    });
  });
  test("Is the book 0691161513 updated?", async () => {
    const res = await request(app)
      .put("/books/0691161513")
      .send({
        isbn: "0691161513",
        amazon_url: "http://a.co/eobPtX3",
        author: "Daniel Danny",
        language: "english",
        pages: 3234,
        publisher: "Deseret Dunes Press",
        title: "Test Book 4",
        year: 2013,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual({
      book: {
        isbn: "0691161513",
        amazon_url: "http://a.co/eobPtX3",
        author: "Daniel Danny",
        language: "english",
        pages: 3234,
        publisher: "Deseret Dunes Press",
        title: "Test Book 4",
        year: 2013,
      },
    });
  });
  test("Is json meeting the schema?", async () => {
    const res = await request(app)
      .put("/books/069116151421")
      .send({
        isbn: "069116151421",
        amazon_url: "http://a.co/eobPtX0",
        author: 13,
        language: ["english", "spanish", "finnish"],
        pages: "2234",
        publisher: "Candy Cane Press",
        title: null,
        year: "2010",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400);
    expect(res.body).toEqual({
      error: {
        message: [
          "instance.isbn does not meet maximum length of 10",
          "instance.author is not of a type(s) string",
          "instance.language is not of a type(s) string",
          "instance.pages is not of a type(s) integer",
          "instance.title is not of a type(s) string",
          "instance.year is not of a type(s) integer",
        ],
        status: 400,
      },
      message: [
        "instance.isbn does not meet maximum length of 10",
        "instance.author is not of a type(s) string",
        "instance.language is not of a type(s) string",
        "instance.pages is not of a type(s) integer",
        "instance.title is not of a type(s) string",
        "instance.year is not of a type(s) integer",
      ],
    });
  });
});

/** DELETE /[isbn]   => {message: "Book deleted"} */
describe("DELETE /books/:code", () => {
  test("Is the book deleted?", async () => {
    const res = await request(app)
      .delete("/books/0691161512")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.message == "Book deleted").toEqual(true);
  });
  test("Are invalid ISBNs handled correctly?", async () => {
    const res = await request(app)
      .delete("/books/0691161513")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.message == "Book deleted").toEqual(true);
  });
});
