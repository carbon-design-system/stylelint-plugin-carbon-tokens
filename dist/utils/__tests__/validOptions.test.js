"use strict";

var _ = require("..");

/**
 * Copyright IBM Corp. 2016, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
describe("isValidOptions", function () {
  it("Option to be invalid", function () {
    expect(
      (0, _.isValidOption)(["/expected to cause warning during test"])
    ).toEqual(false);
  });
});
