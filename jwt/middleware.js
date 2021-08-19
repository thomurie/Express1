const jwt = require("jsonwebtoken");
const err = require("./error");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("./config");

function authenticateJWT(req, res, next) {
  try {
    const payload = jwt.sign({ username }, SECRET_KEY);
    req.user = payload;
    return next();
  } catch (e) {
    next(e);
  }
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    const e = new err("Unauthorized", 401);
    return next(e);
  } else {
    return next();
  }
}

module.exports = { authenticateJWT, ensureLoggedIn };
