const db = require("../db");
const slugify = require("slugify");

class Company {
  static async getAll() {
    const results = await db.query(`SELECT * FROM companies`);
    return results.rows;
  }
  static async getById(code) {
    const results = await db.query(`SELECT * FROM companies WHERE code=$1;`, [
      code,
    ]);
    return results.rows;
  }
  static async addComapany(name, description) {
    const code = slugify(name, "_");
    const results = await db.query(
      `INSERT INTO companies VALUES ($1, $2, $3) RETURNING *`,
      [code, name, description]
    );
    return results.rows;
  }

  static async deleteCompany(code) {
    await db.query(`DELETE FROM companies WHERE code=$1 RETURNING *`, [code]);
    return "deleted";
  }
}

module.exports = Company;
