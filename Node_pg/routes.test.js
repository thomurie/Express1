process.env.NODE_ENV = "test";

const { TestWatcher } = require("jest");
const request = require("supertest");
const app = require("./app");
const db = require("./db");

afterAll(async () => {
  await db.end();
});

describe("GET /home", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get("/home")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("GET /users", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get("/users")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("GET /search", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get("/search")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("POST /addUser", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .post("/addUser")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("PATCH /:id", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .patch("/3")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("DELETE /:id", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .delete("/3")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
