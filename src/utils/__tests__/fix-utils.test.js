/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fixUsingMap } from "../fix-utils.js";

describe("fixUsingMap", () => {
  it("Does not loop forever", () => {
    const newValue = fixUsingMap("$test is this", /test/g, {
      test: "Is a loop test"
    });

    assert.equal(newValue, "$Is a loop test is this");
  });

  it("Does not loop forever if '/g' is missed", () => {
    const newValue = fixUsingMap("$test is this", /test/, {
      test: "Is a loop test"
    });

    assert.equal(newValue, "$Is a loop test is this");
  });
});
