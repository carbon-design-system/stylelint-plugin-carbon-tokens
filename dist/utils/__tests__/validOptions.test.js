"use strict";

var _ = require("..");

describe("isValidOptions", function () {
  it("Option to be invalid", function () {
    expect((0, _.isValidOption)(["/fish"])).toEqual(false);
  });
});