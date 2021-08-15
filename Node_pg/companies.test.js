process.env.NODE_ENV = "test";

const { TestWatcher } = require("jest");
const request = require("supertest");
const app = require("./app");
const db = require("./db");

beforeAll(async () => {
  await db.query(`DELETE FROM companies`);
  await db.query(
    `INSERT INTO companies 
    (code, name, description)
    VALUES
    ('test', 'testcomp', 'This is a test'),
    ('test2', 'testcomp2', '2This is a test')`
  );
});

afterAll(async () => {
  await db.query(`DELETE FROM companies`);
  await db.end();
});

// GET /companies
describe("GET /companies", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get("/companies/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Are All Companies shown?", async () => {
    const res = await request(app)
      .get("/companies/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.companies).toEqual(
      expect.arrayContaining([
        { code: "test", name: "testcomp" },
        { code: "test2", name: "testcomp2" },
      ])
    );
  });
});

// GET /companies/[code]
describe("GET /companies/:code", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get("/companies/test")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Is the correct company returned", async () => {
    const res = await request(app)
      .get("/companies/test")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.company[0].code).toEqual("test");
  });
});

// POST /companies
describe("POST /companies", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .post("/companies")
      .send({
        code: "testlogi",
        name: "testLogitech",
        description: "testMaker of mice",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.company[0].code).toEqual("testlogi");
  });
  test("Is testlogi2 created?", async () => {
    const res = await request(app)
      .post("/companies")
      .send({
        code: "testlogi2",
        name: "testLogitech2",
        description: "2estMaker of mice",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.company[0].code).toEqual("testlogi2");
  });
});

// PUT /companies/[code]
describe("PUT /companies/:code", () => {
  test("Is the name updated?", async () => {
    const res = await request(app)
      .put("/companies/testlogi")
      .send({ name: "testLogi-Tech", description: "Maker of mice" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.company[0].name).toEqual("testLogi-Tech");
  });
  test("Is the description updated?", async () => {
    const res = await request(app)
      .put("/companies/testlogi2")
      .send({ name: "2testLogi-Tech", description: "Premium Maker of mice" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.company[0].description).toEqual("Premium Maker of mice");
  });
});

// DELETE /companies/[code]
describe("DELETE /companies/:code", () => {
  test("Is testlogi deleted?", async () => {
    const res = await request(app)
      .delete("/companies/testlogi")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.status == "deleted").toEqual(true);
  });
  test("Is testlogi2 deleted?", async () => {
    const res = await request(app)
      .delete("/companies/testlogi2")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.status == "deleted").toEqual(true);
  });
});
