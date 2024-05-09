/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { isValidOption } from '../index.js';

describe('isValidOptions', () => {
  let spyWarn;

  beforeEach(() => {
    // The component instantiations that follow will generate a stack of
    // console errors and warnings about required props not provided or
    // conditions not met, and for the purposes of these tests we don't care.
    spyWarn = mock.method(console, 'warn', () => {});
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it('Option to be invalid', () => {
    assert.equal(
      isValidOption(['/asserted to cause warning during test']),
      false
    );
    assert.equal(spyWarn.mock.callCount(), 1);
  });
});
