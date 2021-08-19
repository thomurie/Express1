const express = require("express");
const router = new express.Router();
const Message = require("../models/message");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", (req, res, next) => {
  try {
    if (req.user) {
      const msg = await Message.get(req.params.id);
      if (
        msg.from_user.username === req.user ||
        msg.to_user.username === req.user
      ) {
        return res.json({ message: await Message.get(req.params.id) });
      }
    }
    throw new err("Invalid Username", 401);
  } catch (error) {
    next(error);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", (req, res, next) => {
  try {
    if (req.user) {
      const { to_username, body } = req.body;
      const from_username = req.user;
      if (to_username !== req.user) {
        return res.json({
          message: await Message.create({ from_username, to_username, body }),
        });
      }
    }
    throw new err("Invalid Username", 401);
  } catch (error) {
    next(error);
  }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", (req, res, next) => {
  try {
    if (req.user) {
      return res.json({ message: await Message.markRead(req.params.id) });
    }
    throw new err("Invalid Username", 401);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
