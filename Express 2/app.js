const express = require("express");
const itemRoutes = require("./routes");
const middleware = require("./middleware");
const morgan = require("morgan");

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use("/items", itemRoutes);

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
