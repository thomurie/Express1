/** BizTime express application. */

// third party
const express = require("express");

// config
const app = express();

// local imports
const ExpressError = require("./expressError");
const companies = require(`./routes/companies`);
const invoices = require("./routes/invoices");

app.use(express.json());

/** 404 handler */

app.use(`/companies`, companies);
app.use(`/invoices`, invoices);

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message,
  });
});

module.exports = app;
