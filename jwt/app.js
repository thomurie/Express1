const express = require("express");
const routes = require("./routes");
const { authenticateJWT } = require("./middleware");
const err = require("./error");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(authenticateJWT);
app.use("/", routes);

app.use(() => {
  const error = new err("Not Found", 404);
  return next(error);
});

app.use((error, req, res, next) => {
  let status = error.status || 404;
  let message = error.msg;
  console.log({
    error: { message, status },
  });
  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
