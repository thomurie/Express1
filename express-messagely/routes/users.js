const express = require("express");
const router = new express.Router();
const User = require("../models/user");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", (req, res, next) => {
  try {
    return res.json({ users: await User.all() });
  } catch (error) {
    next(error);
  }
});

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", (req, res, next) => {
  try {
    return res.json({ user: await User.get(req.params.username) });
  } catch (error) {
    next(error);
  }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", (req, res, next) => {
  try {
    return res.json({ messages: await User.messagesTo(req.params.username) });
  } catch (error) {
    next(error);
  }
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", (req, res, next) => {
  try {
    return res.json({ messages: await User.messagesFrom(req.params.username) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
