process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");

const items = require("./fakeDb");

const item = { name: "donut", price: "1.52" };

afterAll(function () {
  console.log("that was easy");
});

// 1.
describe("GET /items/", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get("/items")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Correct Items?", async () => {
    const res = await request(app)
      .get("/items")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toStrictEqual(items);
  });
});

// 2.
describe("POST /items/", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .post("/items/")
      .send({ name: "grapes", price: "4.34" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Is there a new Item?", async () => {
    const res = await request(app)
      .post("/items/")
      .send({ name: "donut", price: "2.34" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toStrictEqual({
      added: { name: "donut", price: "2.34" },
    });
  });
});

// 3.
describe("GET /items/:name", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get("/items/donut")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Is there just one(1) item", async () => {
    const res = await request(app)
      .get("/items/donut")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.name).toEqual("donut");
  });
});

// 4.
describe("PATCH /items/:name", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .patch("/items/donut")
      .send({ price: "2.34" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Is the price updated?", async () => {
    const res = await request(app)
      .patch("/items/donut")
      .send({ price: "2.34" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.update.price).not.toEqual(item.price);
  });
});

// 5.
describe("DELETE /items/:name", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .delete("/items/donut")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Is this working?", async () => {
    const res = await request(app)
      .delete("/items/grapes")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
