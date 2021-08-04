const express = require("express");
const ExpressError = require("./expressError");
const Maths = require("./algs");

const app = express();

app.use(express.json());

app.get("/mean", (req, res, next) => {
  try {
    const receivedNums = req.query.nums || false;
    if (!receivedNums) {
      throw new ExpressError("Numbers are Required", 400);
    }
    const nums = receivedNums.split(",").map((e) => parseInt(e));
    const total = nums.reduce((a, c) => a + c);
    if (Math.abs(total) > 0 === false) {
      throw new ExpressError("Not a Number", 404);
    }

    const meanMath = new Maths(nums, total);
    return res.json({
      response: {
        operation: "mean",
        value: meanMath.mean(),
      },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/median", (req, res, next) => {
  try {
    const receivedNums = req.query.nums || false;
    if (!receivedNums) {
      throw new ExpressError("Numbers are Required", 400);
    }
    let nums = receivedNums.split(",").map((e) => parseInt(e));
    const total = nums.reduce((a, c) => a + c);
    if (Math.abs(total) > 0 === false) {
      throw new ExpressError("Not a Number", 404);
    }

    const medianMaths = new Maths(nums, 0);

    let rotations = 3;
    while (rotations > 0) {
      nums = medianMaths.bubbleSort();
      rotations--;
    }

    return res.json({
      response: {
        operation: "median",
        value: medianMaths.median(nums),
      },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/mode", (req, res, next) => {
  try {
    const receivedNums = req.query.nums || false;
    if (!receivedNums) {
      throw new ExpressError("Numbers are Required", 400);
    }
    const nums = receivedNums.split(",").map((e) => parseInt(e));
    const total = nums.reduce((a, c) => a + c);
    if (Math.abs(total) > 0 === false) {
      throw new ExpressError("Not a Number", 404);
    }
    const modeMaths = new Maths(nums, 0);
    return res.json({
      response: {
        operation: "mode",
        value: modeMaths.findMode(),
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  let status = error.status || 404;
  let message = error.msg;
  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(3000, function () {
  console.log("App on port 3000");
});
