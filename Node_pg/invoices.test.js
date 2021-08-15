process.env.NODE_ENV = "test";

const { TestWatcher } = require("jest");
const request = require("supertest");
const app = require("./app");
const db = require("./db");

let code, code2;

beforeAll(async () => {
  code = null;
  code2 = null;
  await db.query(
    `DELETE FROM companies 
    WHERE code='invtest'
    AND code='2invtest'`
  );
  await db.query(`DELETE FROM invoices`);
  await db.query(
    `INSERT INTO companies 
        (code, name, description)
        VALUES
        ('invtest', '1testcomp', 'This is a test'),
        ('2invtest', '2testcomp', '2This is a test')`
  );
  await db.query(
    `INSERT INTO invoices 
    (comp_code, amt, paid, add_date)
    VALUES
    ('invtest', 1152, true, '20210811'),
    ('2invtest', 152, false, '20210811')`
  );
});

afterAll(async () => {
  await db.query(`DELETE FROM invoices`);
  await db.end();
});

// GET /invoices
describe("GET /invoices", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get("/invoices/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("Are All Companies shown?", async () => {
    const res = await request(app)
      .get("/invoices/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.invoices.length).toEqual(2);
  });
});

// POST /invoices
describe("POST /invoices", () => {
  test("invoice for 1152 to invtest created?", async () => {
    const res = await request(app)
      .post("/invoices/")
      .send({
        comp_code: "invtest",
        amt: 1152,
        paid: false,
        add_date: "20210811",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    code = res.body.invoice[0].id;
    expect(typeof code).toEqual("number");
  });
  test("Is inovices for 152 to 2invtest created?", async () => {
    const res = await request(app)
      .post("/invoices/")
      .send({
        comp_code: "2invtest",
        amt: 152,
        paid: true,
        add_date: "20210811",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    code2 = res.body.invoice[0].id;
    expect(res.body.invoice[0].amt).toEqual(152);
  });
});

// GET /invoices/[id]
describe("GET /invoices/:id", () => {
  test("Is this working?", async () => {
    const res = await request(app)
      .get(`/invoices/${code}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.invoice[0].amt).toEqual(1152);
  });
  test("Is the correct company returned", async () => {
    const res = await request(app)
      .get(`/invoices/${code2}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.invoice[0].comp_code).toEqual("2invtest");
  });
});

// PUT /invoices/:id
describe("PUT /invoices/:id", () => {
  test("Is the amt updated?", async () => {
    const res = await request(app)
      .put(`/invoices/${code}`)
      .send({
        amt: 1234,
        paid: true,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.invoice[0].amt).toEqual(1234);
  });
  test("Is paid updated?", async () => {
    const res = await request(app)
      .put(`/invoices/${code}`)
      .send({
        amt: 1234,
        paid: false,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.invoice[0].paid).toEqual(false);
  });
});

// DELETE /invoices/:id
describe("DELETE /companies/:code", () => {
  test("Is testlogi deleted?", async () => {
    const res = await request(app)
      .delete(`/invoices/${code}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.status == "deleted").toEqual(true);
  });
  test("Is testlogi2 deleted?", async () => {
    const res = await request(app)
      .delete(`/invoices/${code2}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.status == "deleted").toEqual(true);
  });
});
