/** User class for message.ly */

/** User of the site. */
const bcrypt = require("bcrypt");
const client = require("../db");
const err = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  constructor({ username, password, first_name, last_name, phone }) {
    this.username = username;
    this.password = password;
    this.first_name = first_name;
    (this.last_name = last_name), (this.phone = phone);
  }

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const now = new Date();
    const results = await client.query(
      `
    INSERT INTO users (username, password, first_name, last_name, phone, join_at)
    VALUES $1, $2, $3, $4, $5, $6
    `,
      [username, hashedPwd, first_name, last_name, phone, now]
    );

    return results.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    try {
      if (!username || !password) {
        throw new err("username and password required", 400);
      }
      const results = await client.query(
        `SELECT username, password
        FROM users
        WHERE username=$1`,
        [username]
      );
      const user = results.rows[0];
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          return true;
        }
        throw new err("Invalid Password", 401);
      }
      throw new err("Username not found!", 401);
    } catch (error) {
      next(new err("Internal Server Error", 500));
    }
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    try {
      const results = await client.query(
        `SELECT username
        FROM users
        WHERE username=$1`,
        [username]
      );
      const user = results.rows[0];
      if (user) {
        const now = new Date();
        await client.query(
          `
        UPDATE users
        SET last_login_at=$1
        WHERE username=$2`,
          [now, user.username]
        );
      }
      throw new err("Username not found!", 401);
    } catch (error) {
      next(new err("Internal Server Error", 500));
    }
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    results = await client.query(`
    SELECT username, first_name, last_name, phone
    FROM users;`);

    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    try {
      const results = await client.query(
        `SELECT username, first_name, last_name, phone, join_at, last_login_at
        FROM users
        WHERE username=$1`,
        [username]
      );
      const user = results.rows[0];
      if (user) {
        return user;
      }
      throw new err("Username not found!", 401);
    } catch (error) {
      next(new err("Internal Server Error", 500));
    }
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    try {
      const results = await client.query(
        `SELECT username
        FROM users
        WHERE username=$1`,
        [username]
      );
      const user = results.rows[0];
      if (user) {
        const getMsgs = await client.query(
          `
          SELECT m.id, m.to_username, t.fist_name, t.last_name, t.phone, m.body, m.sent_at, m.read_at
          FROM messages AS m
          JOIN users AS t
          ON m.to_username=t.username
          WHERE m.from_username=$1
        `,
          [username]
        );
        return getMsgs.rows.map((m) => ({
          id: m.id,
          to_user: {
            username: m.to_username,
            first_name: m.first_name,
            last_name: m.last_name,
            phone: m.phone,
          },
          body: m.body,
          sent_at: m.sent_at,
          read_at: m.read_at,
        }));
      }
      throw new err("Username not found!", 401);
    } catch (error) {
      next(new err("Internal Server Error", 500));
    }
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    try {
      const results = await client.query(
        `SELECT username, first_name, last_name, phone, join_at, last_login_at
        FROM users
        WHERE username=$1`,
        [username]
      );
      const user = results.rows[0];
      if (user) {
        const getMsgs = await client.query(`
          SELECT m.id, m.from_username, t.fist_name, t.last_name, t.phone, m.body, m.sent_at, m.read_at
          FROM messages AS m
          JOIN users AS t
          ON m.from_username=t.username
          WHERE m.to_username=$1
        `);
        return getMsgs.rows.map((m) => ({
          id: m.id,
          from_user: {
            username: m.from_username,
            first_name: m.first_name,
            last_name: m.last_name,
            phone: m.phone,
          },
          body: m.body,
          sent_at: m.sent_at,
          read_at: m.read_at,
        }));
      }
      throw new err("Username not found!", 401);
    } catch (error) {
      next(new err("Internal Server Error", 500));
    }
  }
}

module.exports = User;
