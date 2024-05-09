/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// There are no type tokens that are used directly
// Types are applied via mixins and functions
// const typeTokens = [];
import loadModules, { loadPackageJson } from '../../../utils/loadModules.js';

const doInit = async ({ carbonPath, carbonModulePostfix }) => {
  // permitted carbon type functions
  // TODO: read this from carbon
  let typeFunctions;
  let _version;

  if (carbonPath) {
    const { pkg } = await loadModules(
      carbonPath,
      ['type'],
      carbonModulePostfix
    );

    _version = pkg.version;
  } else {
    const pkg = loadPackageJson('@carbon/type');

    _version = pkg.version;
  }

  const isV10 = _version.startsWith('10');

  if (isV10) {
    typeFunctions = [
      {
        name: 'carbon--font-weight',
        accept: true,
      },
      {
        name: 'carbon--type-scale',
        accept: true,
      },
      {
        name: 'carbon--font-family',
        accept: true,
      },
    ];
  } else {
    typeFunctions = [
      {
        name: 'font-weight',
        accept: true,
      },
      {
        name: 'type-scale',
        accept: true,
      },
      {
        name: 'font-family',
        accept: true,
      },
    ];
  }

  return { typeFunctions, version: _version };
};

export { doInit };
