/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseOptions } from '../index.js';

describe('parseOptions', () => {
  const defaults = {
    includeProps: ['1', '3', '4'],
    acceptValues: ['1', '5', '6'],
    acceptCarbonColorTokens: false,
    acceptIBMColorTokensCarbonV10Only: false,
    acceptUndefinedVariables: true,
  };

  const options1 = undefined;

  it('Uses default options when options undefined', () => {
    assert.deepEqual(parseOptions(options1, defaults), defaults);
  });

  const options2 = {};

  it('Uses default options when options {}', () => {
    assert.deepEqual(parseOptions(options2, defaults), defaults);
  });

  const options3 = { includeProps: [] };

  it('Uses default options when options without acceptValues', () => {
    assert.deepEqual(parseOptions(options3, defaults), defaults);
  });

  const options4 = { acceptValues: [] };

  it('Uses default options when options without includeProps', () => {
    assert.deepEqual(parseOptions(options4, defaults), defaults);
  });

  const options5 = {
    includeProps: ['*'],
    acceptValues: ['*'],
  };

  it('Uses default options when using * only', () => {
    assert.deepEqual(parseOptions(options5, defaults), defaults);
  });

  const options6 = {
    includeProps: ['*', 'banana'],
    acceptValues: ['fish', '*'],
  };

  const combinedOpts1 = {
    includeProps: ['banana'].concat(defaults.includeProps),
    acceptValues: ['fish'].concat(defaults.acceptValues),
    acceptCarbonColorTokens: false,
    acceptIBMColorTokensCarbonV10Only: false,
    acceptUndefinedVariables: true,
  };

  it('Adds default options when using *', () => {
    assert.deepEqual(parseOptions(options6, defaults), combinedOpts1);
  });

  const options7 = {
    includeProps: ['*', 'cake', '2', '3'],
    acceptValues: ['eagle', '*', '5', '7'],
  };

  const combinedOpts2 = {
    includeProps: ['cake', '2', '3'].concat(
      defaults.includeProps.filter((item) => item !== '3')
    ),
    acceptValues: ['eagle', '5', '7'].concat(
      defaults.acceptValues.filter((item) => item !== '5')
    ),
    acceptCarbonColorTokens: false,
    acceptIBMColorTokensCarbonV10Only: false,
    acceptUndefinedVariables: true,
  };

  it('Combines default options when using *', () => {
    assert.deepEqual(parseOptions(options7, defaults), combinedOpts2);
  });
});
