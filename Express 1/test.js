const assert = require("assert");
const Maths = require("./algs");

describe("Array", function () {
  describe("#indexOf()", function () {
    it("should return -1 when the value is not present", function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe("Maths", function () {
  describe("Mean", function () {
    const nums = [1, 3, 5, 5, 7];
    const total = nums.reduce((a, c) => a + c);
    const testMaths = new Maths(nums, total);
    it("should return the mean of the values in the array", function () {
      assert.equal(testMaths.mean(), 4.2);
    });
  });
  describe("Median", function () {
    const nums = [1, 3, 5, 5, 7];
    const total = nums.reduce((a, c) => a + c);
    const testMaths = new Maths(nums, total);
    it("should return the median of the values in the array", function () {
      assert.equal(testMaths.median(), 5);
    });
  });
  describe("Mode", function () {
    const nums = [1, 3, 5, 5, 7];
    const total = nums.reduce((a, c) => a + c);
    const testMaths = new Maths(nums, total);
    it("should return the mode of the values in the array", function () {
      assert.equal(testMaths.findMode(), 5);
    });
  });
});
