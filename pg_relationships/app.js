const express = require("express");
const morgan = require("morgan");
const err = require("./expressError");
const app = express();
const routes = require("./routes");

app.use(express.json());
app.use(morgan("dev"));

app.use("/users", routes);

app.use((req, res, next) => {
  const error = new err("Not Found", 404);

  return next(error);
});

module.exports = app;
